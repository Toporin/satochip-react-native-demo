import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext } from 'react';
import * as bip39 from 'bip39';

import { AppContext } from '../contexts/AppContext';
//import { CKTapCard } from 'cktap-protocol-react-native';
import { SatochipCard } from 'satochip-react-native';
import InputBox from './InputBox';

const COMMANDS = [
  'setup',
  'get-status',
  'change-pin',
  'verify-pin',
  'get-authentikey',
  'get-extendedkey',
  'import-seed',
  'reset-seed',
  'sign-hash',
  'export-cert',
  'challenge-response',
  'validate-cert',

  'Start Over',
];
const SatochipCommands = ({
  withModal,
  card,
  startOver,
}: {
  withModal: any;
  card: SatochipCard;
  startOver: any;
}) => {
  const [visible, setVisible] = React.useState(false);
  const [inputs, setInputs] = React.useState(new Map());
  const [values, setValues] = React.useState<string[]>([]);
  const [callback, setCallback] = React.useState<string>('');
  const [unlocking, setUnlocking] = React.useState<boolean>(false);
  const { cvc, setCvc } = useContext(AppContext);

  const cleanup = () => {
    setInputs(new Map());
    setCallback('');
  };

  const interact = (cmd = '') => {
    const name = cmd ? cmd : callback;
    switch (name) {

      case 'setup':
        withModal(async () => {
          const pin = inputs.get('new_pin');
          await card.setup(pin);
          return `Card setup successfully!`
        }, name);
        cleanup();
        break;

      case 'verify-pin':
        withModal(async () => {
          await card.verifyPIN(0, inputs.get('pin'));
          return `PIN verified successfully!`
        }, name);
        cleanup();
        break;

      case 'change-pin':
        withModal(
          () => card.changePIN(0, inputs.get('old_pin'), inputs.get('new_pin')),
          name
        );
        cleanup();
        break;

      case 'get-extendedkey':
        withModal(async () => {
          let path = inputs.get('path') ?? `m/44'/0'/0'/0/0`;
          console.log(`SatochipCommands get-extendedkey path: ${path}`)
          const {pubkey, chaincode} = await card.getExtendedKey(path);
          console.log(`SatochipCommands get-extendedkey pubkey: ${pubkey.toString('hex')}`)
          console.log(`SatochipCommands get-extendedkey chaincode: ${chaincode.toString('hex')}`)
          return `Pubkey: ${pubkey.toString('hex')} \nChaincode: ${chaincode.toString('hex')}`;
          //return `Pubkey: ${pubkey.toString('hex')}`;
        }, name);

        cleanup();
        break;

      case 'import-seed':
        withModal(async () => {
          const mnemonic = inputs.get('mnemonic');
          const passphrase = inputs.get('passphrase') ?? '';
          console.log(`SatochipCommands get-extendedkey mnemonic: ${mnemonic}`)
          console.log(`SatochipCommands get-extendedkey passphrase: ${passphrase}`)

          // Validate mnemonic
          console.log(`SatochipCommands import-seed checking mnemonic validity...`)
          if (!bip39.validateMnemonic(mnemonic)) {
            throw new Error('Invalid mnemonic');
          } else {
            console.log(`SatochipCommands import-seed mnemonic valid!`)
          }

          // debug
//           const entropy = bip39.mnemonicToEntropy(mnemonic);
//           console.log(`SatochipCommands import-seed entropy: ${entropy}`)

          // Convert to seed
          const seed = bip39.mnemonicToSeedSync(mnemonic, passphrase);
          console.log(`SatochipCommands import-seed seed: ${seed.toString('hex')}`)

          await card.importSeed(seed);

          return `Seed imported successfully!`
        }, name);

        cleanup();
        break;

      case 'reset-seed':
        withModal(async () => {
          await card.resetSeed(inputs.get('pin'))
          return `Seed reset successfully!`
        }, name);

        cleanup();
        break;

      case 'sign-hash':
        withModal(async () => {
          let path = inputs.get('path') ?? `m/44'/0'/0'/0/0`;
          console.log(`SatochipCommands sign-hash path: ${path}`)
          const {pubkey, chaincode} = await card.getExtendedKey(path);
          console.log(`SatochipCommands sign-hash pubkey: ${pubkey.toString('hex')}`)
          console.log(`SatochipCommands sign-hash chaincode: ${chaincode.toString('hex')}`)

          const hashString = inputs.get('hash') ?? '00'.repeat(32);
          const hashBytes = Buffer.from(hashString, 'hex');
          const derSig = await card.signTransactionHash(0xff, hashBytes);
          console.log(`SatochipCommands sign-hash derSig: ${derSig.toString('hex')}`)
          return derSig.toString('hex');
        }, name);

        cleanup();
        break;

      default:
        break;
    }
  };

  const getInputs = (name: string, ins: string[]) => {
    ins = ins.filter(input => !(input === 'cvc' && cvc));
    if (!ins.length) {
      // passing name here as setCallback is async
      interact(name);
    } else {
      setValues(ins);
      setVisible(true);
    }
  };

  const onPress = (name: string) => {
    setCallback(name);
    switch (name) {
      case 'get-status':
          withModal(async () => {
            const satochipStatus = await card.getStatus();
            return satochipStatus;
          }, name);
          break;

      case 'setup':
        getInputs('setup', ['new_pin']);
        break;

      case 'verify-pin':
        getInputs('verify-pin', ['pin']);
        break;
      case 'change-pin':
        getInputs('change-pin', ['old_pin', 'new_pin']);
        break;

      case 'get-authentikey':
        withModal(async () => {
          const authentikey = await card.getAuthentikey();
          return authentikey.getPublicKeyBytes().toString('hex');
        }, name);
        break;

      case 'get-extendedkey':
        getInputs('get-extendedkey', ['path']);
        break;

      case 'import-seed':
        getInputs('import-seed', ['mnemonic', 'passphrase']);
        break;
      case 'reset-seed':
        getInputs('reset-seed', ['pin']);
        break;

      case 'sign-hash':
        getInputs('sign-hash', ['path', 'hash']);
        break;

      case 'export-cert':
        withModal(async () => {
          const devicePem = await card.exportPersoCertificate();
          return devicePem;
        }, name);
        break;

      case 'challenge-response':
        withModal(async () => {
          const res = await card.cardChallengeResponsePki();
          return res;
        }, name);
        break;

      case 'validate-cert':
        withModal(async () => {
          const res = await card.verifyCertificateChain();
          return res;
        }, name);
        break;

      default:
        break;
    }
  };
  if (unlocking) {
    return <ActivityIndicator color={'#000'} />;
  }
  return (
    <View style={styles.container}>
      {COMMANDS.map((name: any) => {
        const _onPress = () => onPress(name);
        return (
          <TouchableOpacity key={name} onPress={_onPress} style={styles.button}>
            <Text style={styles.text}>{name}</Text>
          </TouchableOpacity>
        );
      })}
      <InputBox
        command={callback}
        visible={visible}
        inputs={inputs}
        items={values}
        setInputs={setInputs}
        setVisible={setVisible}
        interact={interact}
      />
    </View>
  );
};

export default SatochipCommands;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  alignCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'rgba(255,255,255,1)',
    elevation: 6,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 3 },
    padding: 8,
    borderRadius: 10,
    margin: 5,
  },
  text: { color: 'black' },
});
