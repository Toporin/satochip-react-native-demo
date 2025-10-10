import React from 'react';
import Satscard from '../screens/Satscard';
import Tapsigner from '../screens/Tapsigner';
import Satochip from '../screens/Satochip';

const Card = ({ cardType, card, withModal, status, startOver }: any) => {
  switch (cardType) {
    case 'TAPSIGNER':
      return (
        <Tapsigner
          card={card}
          withModal={withModal}
          status={status}
          startOver={startOver}
        />
      );
    case 'SATOCHIP':
      return (
        <Satochip
          card={card}
          withModal={withModal}
          status={status}
          startOver={startOver}
        />
      );
    case 'SATSCARD':
    default:
      return (
        <Satscard
          card={card}
          withModal={withModal}
          status={status}
          startOver={startOver}
        />
      );
  }
};

export default Card;
