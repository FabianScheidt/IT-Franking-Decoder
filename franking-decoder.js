class FrankingDecoder {
  // Lookup lists obtained from https://gist.github.com/5263/1208694
  frankingTypesAndVersions = {
    0x01: "Stampit 2003",
    0x03: "Frankit",
    0x05: "Filiale",
    0x07: "Frankierservice Infopost/Infobrief",
    0x08: "Premiumadress",
    0x09: "Pressepost Randbeschriftung 52x52 Module, Version 1",
    0x12: "DV-Freimachung",
    0x18: "Elektroreturn",
    0x19: "Pressepost Etikett, Version 1",
    0x1a: "Pressepost Randbeschriftung 16x28 Module, Version 1",
    0x1c: "Premiumadress Label",
    0x30: "Plusbrief",
    0x33: "Stampit",
    0x42: "Plusbrief/Marke individuell",
    0x52: "Elektroreturn",
    0x85: "Internetmarke",
  };

  products = {
    1: "Standardbrief",
    2: "Standardbrief Einschreiben Einwurf",
    7: "Standardbrief Einschreiben",
    8: "Standardbrief Einschreiben + Rückschein",
    9: "Standardbrief Einschreiben + Eigenhändig",
    10: "Standardbrief Einschreiben + Eigenhändig + Rückschein",
    11: "Kompaktbrief",
    21: "Großbrief",
    32: "Maxibrief",
    51: "Postkarte",
    76: "Büchersendung Standard",
    77: "Büchersendung Kompakt",
    78: "Büchersendung Groß",
    79: "Büchersendung Maxi",
    81: "Warensendung Kompatk",
    82: "Warensendung Maxi",
    83: "Warensendung Standard",
    80: "Warensendung Standard",
    86: "Infobrief/Katalog Standard",
    87: "Infobrief/Katalog Kompakt",
    88: "Infobrief/Katalog Groß",
    89: "Infobrief/Katalog Maxi",
    90: "Infopost/Katalog",
    450: "Pressesendung E+0",
    451: "Pressesendung E+1",
    452: "Pressesendung E+2",
    453: "Postvertriebsstk. E+0",
    454: "Postvertriebsstk. E+1",
    455: "Postvertriebsstk. E+2",
    3106: "Infopost/Katalog Kompakt",
    3101: "Infopost/Katalog Kompakt >20g",
    3107: "Infopost/Katalog Groß",
    3108: "Infopost/Katalog Maxi",
    3104: "Infopost/Katalog Maxi >20g",
    3105: "Infopost/Katalog Maxi >100g",
    9001: "Standardbrief PremA",
    9279: "Pressesendung E+0 PremA",
    9280: "Pressesendung E+1 PremA",
    9287: "Pressesendung E+2 PremA",
  };

  constructor(str) {
    this.str = str;
  }

  decode() {
    return {
      postalCompany: this.decodeStr(0, 3),
      frankingTypeAndVersion: this.decodeLookup(
        this.frankingTypesAndVersions,
        3
      ),
      versionOfProductsAndPrices: this.decodeInt(4),
      customerNumber: this.decodeInt(5, 10),
      chargeOrFrankingValue: this.decodePrice(10, 12),
      dateOfPostingOrElectronicProcessing: this.decodeDate(12, 14),
      productKey: this.decodeLookup(this.products, 14, 16),
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

  decodeLookup(lookup, indexStart, indexEnd) {
    const int = this.decodeInt(indexStart, indexEnd);
    const str = lookup[int] ?? "unknown";
    return `${str} (${int})`;
  }
}
