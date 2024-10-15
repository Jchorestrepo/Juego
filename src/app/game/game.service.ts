import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private adsRemoved = false;

  getRandomPosition(maxWidth: number, maxHeight: number) {
    return {
      x: Math.floor(Math.random() * (maxWidth - 50)),
      y: Math.floor(Math.random() * (maxHeight - 50)),
    };
  }

  showInterstitialAd(): Promise<void> {
    if (this.adsRemoved) return Promise.resolve();
    console.log('Mostrando anuncio intersticial simulado');
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  showRewardedAd(): Promise<boolean> {
    if (this.adsRemoved) return Promise.resolve(true);
    console.log('Mostrando anuncio recompensado simulado');
    return new Promise(resolve => setTimeout(() => resolve(true), 2000));
  }

  removeAds() {
    this.adsRemoved = true;
    console.log('Anuncios eliminados');
  }

  areAdsRemoved(): boolean {
    return this.adsRemoved;
  }
}