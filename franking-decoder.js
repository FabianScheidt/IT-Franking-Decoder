class FrankingDecoder {
  constructor(str) {
    this.str = str;
  }

  decode() {
    return {
      postalCompany: this.decodeStr(0, 3),
      frankingTypeAndVersion: this.decodeInt(3),
      versionOfProductsAndPrices: this.decodeInt(4),
      customerNumber: this.decodeInt(5, 10),
      chargeOrFrankingValue: this.decodePrice(10, 12),
      dateOfPostingOrElectronicProcessing: this.decodeDate(12, 14),
      productKey: this.decodeInt(14, 16),
      uniqueConsecutiveItemNumber: this.decodeInt(16, 19),
      subscriptionNumber: this.decodeInt(19, 20),
      postingCertificateNumber: this.decodeInt(20, 22),
    };
  }

  decodeStr(indexStart, indexEnd) {
    return this.str.substring(indexStart, indexEnd);
  }

  decodeInt(indexStart, indexEnd) {
    indexEnd = indexEnd ?? indexStart + 1;

    let res = 0;
    for (let i = indexStart; i < indexEnd; i++) {
      res = res * 256 + this.str.charCodeAt(i);
    }
    return res;
  }

  decodePrice(indexStart, indexEnd) {
    const euro = this.decodeInt(indexStart, indexEnd - 1);
    const cents = this.decodeInt(indexEnd - 1, indexEnd);
    return euro + cents / 100;
  }

  decodeDate(indexStart, indexEnd) {
    const decodedInt = this.decodeInt(indexStart, indexEnd);
    const year = decodedInt % 100;
    const dayOfYear = Math.floor(decodedInt / 100);
    const date = new Date(2000 + year, 0);
    return new Date(date.setDate(dayOfYear));
  }
}
