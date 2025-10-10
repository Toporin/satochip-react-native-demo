import { CKTapCard, SatochipCard } from 'satochip-react-native';

export type CardType = 'TAPSIGNER' | 'SATSCARD' | 'SATOCHIP' | null;

export interface CardDetectionResult {
  cardType: CardType;
  card: CKTapCard | SatochipCard | null;
  rawResponse?: any;
}

export class CardDetector {
  private cktapCard: CKTapCard;
  private satochipCard: SatochipCard;

  constructor() {
    this.cktapCard = new CKTapCard();
    this.satochipCard = new SatochipCard();
  }

  async detectCard(): Promise<CardDetectionResult> {
    // Try CKTap protocol first (Satscard/Tapsigner)
    try {
      const cktapResponse = await this.cktapCard.first_look();
      
      // If we get here, it's a CKTap card
      const cardType = cktapResponse.is_tapsigner ? 'TAPSIGNER' : 'SATSCARD';
      
      return {
        cardType,
        card: this.cktapCard,
        rawResponse: cktapResponse
      };
    } catch (error: any) {
      console.log('CKTap detection failed:', error?.message || error);
      
      // Try Satochip protocol
      try {

        // select applet
        this.satochipCard.selectApplet();

        const satochipStatus = await this.satochipCard.getStatus();
        
        return {
          cardType: 'SATOCHIP',
          card: this.satochipCard,
          rawResponse: satochipStatus
        };
      } catch (satochipError: any) {
        console.log('Satochip detection failed:', satochipError?.message || satochipError);
        
        // If both fail, return null
        return {
          cardType: null,
          card: null,
          rawResponse: null
        };
      }
    }
  }

  async endNfcSession(): Promise<void> {
    try {
      await this.cktapCard.endNfcSession();
    } catch (error) {
      // Ignore errors when ending session
    }
    try {
      await this.satochipCard.endNfcSession();
    } catch (error) {
      // Ignore errors when ending session
    }
  }

  // Wrap the detection in NFC session management
  async nfcWrapper<T>(callback: () => Promise<T>): Promise<T> {
    // Use CKTapCard's NFC wrapper as it's more established
    return await this.cktapCard.nfcWrapper(callback);
  }
}