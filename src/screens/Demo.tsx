import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Card from '../components/Card';
import NfcPrompt from '../components/NfcPromptAndroid';
import { _setStatus } from '../utils.ts/commandUtils';
import { useTheme } from '@react-navigation/native';
import { CardDetector, CardType } from '../utils.ts/cardDetector';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={[styles.openSourceText]}>Made by Hexa with ♥</Text>
    </View>
  );
};

const Demo = () => {
  const [cardType, setCardType] = useState<CardType>(null);
  const [status, setStatus] = useState<any>();
  const [currentCard, setCurrentCard] = useState<any>(null);
  const cardDetector = useRef(new CardDetector()).current;
  const [prompt, setPrompt] = React.useState<boolean>(false);

  const ignoreCommand = () => {
    setPrompt(false);
    _setStatus(
      status?.response ?? null,
      'none',
      false,
      setStatus,
      cardType || 'SATSCARD'
    );
  };

  const withModal = async (callback: any, command: string) => {
    try {
      let resp;
      
      if (cardType === 'SATOCHIP') {
        // For Satochip, use its own nfcWrapper
        resp = await currentCard.nfcWrapper(callback);
      } else {
        // For CKTap cards (Satscard/Tapsigner), use the existing wrapper
        resp = await currentCard.nfcWrapper(callback);
      }
      
      _setStatus(
        resp,
        command,
        false,
        setStatus,
        cardType || 'SATSCARD'
      );
      return resp;
    } catch (error: any) {
      if (error.toString() === 'Error') {
        return;
      }
      _setStatus(
        error.toString(),
        command,
        true,
        setStatus,
        cardType || 'SATSCARD'
      );
    }
  };

  const startOver = async () => {
    _setStatus(
      null,
      '',
      false,
      setStatus,
      cardType || 'SATSCARD'
    );
    setCardType(null);
    setCurrentCard(null);
    await cardDetector.endNfcSession();
    initiate();
  };

  const initiate = async () => {
    setPrompt(true);
    
    try {
      const result = await cardDetector.nfcWrapper(async () => {
        return await cardDetector.detectCard();
      });

      if (result.cardType) {
        setCardType(result.cardType);
        setCurrentCard(result.card);
        _setStatus(
          result.rawResponse,
          'check-status',
          false,
          setStatus,
          result.cardType
        );
      } else {
        _setStatus(
          'No supported card detected',
          'check-status',
          true,
          setStatus,
          'SATSCARD'
        );
      }
    } catch (error: any) {
      if (error.toString() === 'Error') {
        return;
      }
      _setStatus(
        error.toString(),
        'check-status',
        true,
        setStatus,
        'SATSCARD'
      );
    } finally {
      setPrompt(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      initiate();
    }, 1000);
  }, []);

  const theme = useTheme();
  
  const getWaitingMessage = () => {
    return cardType === null ? 
      'Waiting for a card to be scanned...' : 
      'Card detected. Processing...';
  };

  return (
    <>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <SafeAreaView style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps={'always'}>
          {cardType === null || currentCard === null ? (
            <View style={styles.container}>
              <Text style={styles.text}>
                {getWaitingMessage()}
              </Text>
            </View>
          ) : (
            <View style={styles.container}>
              <Card
                cardType={cardType}
                card={currentCard}
                withModal={withModal}
                status={status}
                startOver={startOver}
              />
            </View>
          )}
        </ScrollView>
        <NfcPrompt visible={prompt} ignoreCommand={ignoreCommand} />
        <Footer />
      </SafeAreaView>
    </>
  );
};

export default Demo;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 5,
  },
  footer: {
    alignItems: 'center',
    marginBottom: '5%',
  },
  openSourceText: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    color: 'black',
  },
  text: {
    color: 'black',
    fontSize: 18,
    letterSpacing: 1,
  },
});
