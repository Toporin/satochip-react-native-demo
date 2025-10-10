import { Image } from 'react-native';
import React from 'react';
import SatochipCommands from '../components/SatochipCommands';
import StatusDetails from '../components/StatusDetails';

const Satochip = ({ withModal, card, status, startOver }: any) => {
  return (
    <>
      <Image
        source={require('../assets/satscard-front.png')}
        style={{ width: 571 / 2.5, height: 360 / 2.5 }}
      />
      <StatusDetails status={status} />
      <SatochipCommands withModal={withModal} card={card} startOver={startOver} />
    </>
  );
};

export default Satochip;
