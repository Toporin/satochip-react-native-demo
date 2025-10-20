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
    'get-status',
    'change-pin',
    'verify-pin',
    'get-authentikey',
    'get-extendedkey',
    'import-seed',
    'reset-seed',
//   'check-status',
//   'verify-certs',
//   'slot-usage',
//   'setup-slot',
//   'address',
//   'get-pubkey',
//   'unseal-slot',
//   'get-privkey',
//   'wait',
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
      case 'change-pin':
        withModal(
          () => card.changePIN(0, inputs.get('old_pin'), inputs.get('new_pin')),
          name
        );
        cleanup();
        break;

      case 'verify-pin':
        withModal(async () => {
          card.verifyPIN(0, inputs.get('pin'));
          return `PIN verified successfully!`
        }, name);
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




//       case 'get-authentikey':
//         withModal(
//           () => card.getAuthentikey(),
//           name
//         );
//         cleanup();
//         break;

//       case 'setup-slot':
//         withModal(
//           () => card.setup(inputs.get('cvc') || cvc, undefined, true),
//           name
//         );
//         cleanup();
//         break;
//       case 'sign':
//         withModal(
//           () =>
//             card.sign_digest(inputs.get('cvc') || cvc, 0, inputs.get('digest')),
//           name
//         );
//         cleanup();
//         break;
//       case 'change-cvc':
//         withModal(
//           () => card.change_cvc(inputs.get('old_cvc'), inputs.get('new_cvc')),
//           name
//         );
//         cleanup();
//         break;
//       case 'verify-cvc':
//         withModal(() => card.read(inputs.get('cvc') || cvc), name);
//         cleanup();
//         break;
//       case 'slot-usage':
//         withModal(async () => {
//           const slots = [];
//           for (let i = 0; i < 10; i++) {
//             const slot = await card.get_slot_usage(i, inputs.get('cvc') || cvc);
//             slots.push(slot);
//           }
//           return slots;
//         }, name);
//         cleanup();
//         break;
//       case 'unseal-slot':
//         withModal(() => card.unseal_slot(inputs.get('cvc') || cvc), name);
//         cleanup();
//         break;
//       case 'get-privkey':
//         withModal(
//           () =>
//             card.get_privkey(
//               inputs.get('cvc') || cvc,
//               Number(inputs.get('slot') || card.active_slot)
//             ),
//           name
//         );
//         cleanup();
//         break;
//       case 'address':
//         withModal(
//           () =>
//             card.address(
//               inputs.get('faster'),
//               inputs.get('includePubkey'),
//               inputs.get('slot')
//                 ? Number(inputs.get('slot'))
//                 : inputs.get('slot')
//             ),
//           name
//         );
//         cleanup();
//         break;
//       case 'get-pubkey':
//         withModal(
//           () => card.get_pubkey(inputs.get('cvc'), inputs.get('subpath')),
//           name
//         );
//         cleanup();
//         break;
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

      case 'change-pin':
        getInputs('change-pin', ['old_pin', 'new_pin']);
        break;
      case 'verify-pin':
        getInputs('verify-pin', ['pin']);
        break;

      case 'get-authentikey':
        withModal(async () => {
          const authentikey = await card.getAuthentikey();
          return authentikey.getPublicKeyBytes().toString('hex'); //"TEST GET-AUTHENTIKEY"; //
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




      //// TODO REMOVE
      case 'check-status':
        withModal(() => card.first_look(), name);
        break;

      case 'verify-certs':
        withModal(async () => {
          if (card.applet_version !== '0.9.0') {
            const { pubkey } = await card.get_pubkey();
            return card.certificate_check(pubkey);
          } else {
            return card.certificate_check();
          }
        }, name);
        break;
      case 'slot-usage':
        getInputs('slot-usage', ['cvc']);
        break;
      case 'unseal-slot':
        getInputs('unseal-slot', ['cvc']);
        break;
      case 'get-privkey':
        getInputs('get-privkey', ['cvc', 'slot']);
        break;
      case 'address':
        getInputs('address', ['faster', 'includePubkey', 'slot']);
        break;
      case 'get-pubkey':
        getInputs('get-pubkey', ['cvc', 'subpath']);
        break;
      case 'setup-slot':
        getInputs('setup-slot', ['cvc']);
        break;
      case 'sign':
        getInputs('sign', ['cvc', 'digest']);
        break;
      case 'change-cvc':
        getInputs('change-cvc', ['old_cvc', 'new_cvc']);
        break;
      case 'wait':
        withModal(async () => {
          const status = await card.first_look();
          if (status.auth_delay) {
            setUnlocking(true);
            setCvc('');
            for (let i = 0; i < status.auth_delay; i++) {
              await card.wait();
            }
            setUnlocking(false);
            return card.first_look();
          } else return status;
        }, name);
        break;
      case 'verify-cvc':
        getInputs('verify-cvc', ['cvc']);
        break;
      case 'Start Over':
        setCvc('');
        startOver();
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
