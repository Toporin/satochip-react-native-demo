import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SatochipCard } from 'satochip-react-native';
import StatusDetails from '../components/StatusDetails';

interface SatochipProps {
  card: SatochipCard;
  withModal: (callback: () => Promise<any>, command: string) => Promise<any>;
  status: any;
  startOver: () => void;
}

const Satochip: React.FC<SatochipProps> = ({
  card,
  withModal,
  status,
  startOver,
}) => {
  const [cardInfo, setCardInfo] = useState<any>(null);

  const getCardStatus = async () => {
    await withModal(async () => {
      const info = await card.getCardInfo();
      setCardInfo(info);
      return info;
    }, 'get-card-info');
  };

  const refreshStatus = async () => {
    await withModal(async () => {
      const satochipStatus = await card.getStatus();
      return satochipStatus;
    }, 'get-status');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Satochip Card</Text>
        <Text style={styles.subtitle}>Hardware Wallet</Text>
      </View>

      {cardInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Card Information:</Text>
          <Text style={styles.infoText}>Applet Version: {cardInfo.appletVersion}</Text>
          <Text style={styles.infoText}>Protocol Version: {cardInfo.protocolVersion}</Text>
          <Text style={styles.infoText}>Setup Done: {cardInfo.setupDone ? 'Yes' : 'No'}</Text>
          <Text style={styles.infoText}>Is Seeded: {cardInfo.isSeeded ? 'Yes' : 'No'}</Text>
          <Text style={styles.infoText}>Needs 2FA: {cardInfo.needs2FA ? 'Yes' : 'No'}</Text>
          <Text style={styles.infoText}>PIN 0 Tries Left: {cardInfo.pinStates.pin0Tries}</Text>
          <Text style={styles.infoText}>PIN 1 Tries Left: {cardInfo.pinStates.pin1Tries}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={getCardStatus}>
          <Text style={styles.buttonText}>Get Card Info</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={refreshStatus}>
          <Text style={styles.buttonText}>Refresh Status</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={startOver}>
          <Text style={styles.resetButtonText}>Scan New Card</Text>
        </TouchableOpacity>
      </View>

      <StatusDetails status={status} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Satochip;