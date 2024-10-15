import { Component, ViewChild, ElementRef } from '@angular/core';
import { Screen, alert, confirm } from '@nativescript/core';
import { GameService } from './game.service';

@Component({
  selector: 'ns-game',
  templateUrl: './game.component.html',
})
export class GameComponent {
  @ViewChild('target', { static: false }) targetRef: ElementRef;

  score = 0;
  timeLeft = 30;
  gameRunning = false;
  targetPosition = { x: 0, y: 0 };

  constructor(private gameService: GameService) {}

  startGame() {
    this.score = 0;
    this.timeLeft = 30;
    this.gameRunning = true;
    this.moveTarget();
    this.startTimer();
  }

  onTargetTap() {
    if (this.gameRunning) {
      this.score++;
      this.moveTarget();
    }
  }

  moveTarget() {
    const screenWidth = Screen.mainScreen.widthDIPs;
    const screenHeight = Screen.mainScreen.heightDIPs;
    this.targetPosition = this.gameService.getRandomPosition(screenWidth, screenHeight);
  }

  startTimer() {
    const timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(timer);
        this.gameRunning = false;
        this.endGame();
      }
    }, 1000);
  }

  endGame() {
    alert({
      title: "¡Juego terminado!",
      message: `Tu puntuación: ${this.score}`,
      okButtonText: "OK"
    }).then(() => {
      this.gameService.showInterstitialAd();
    });
  }

  onExtraTimeRequest() {
    if (!this.gameService.areAdsRemoved()) {
      confirm({
        title: "¿Quieres más tiempo?",
        message: "Mira un anuncio para obtener 10 segundos extra",
        okButtonText: "Ver anuncio",
        cancelButtonText: "No, gracias"
      }).then(result => {
        if (result) {
          this.gameService.showRewardedAd().then(rewarded => {
            if (rewarded) {
              this.timeLeft += 10;
            }
          });
        }
      });
    } else {
      this.timeLeft += 10;
    }
  }

  onRemoveAdsRequest() {
    confirm({
      title: "Eliminar anuncios",
      message: "¿Quieres eliminar todos los anuncios por $0.99?",
      okButtonText: "Comprar",
      cancelButtonText: "Cancelar"
    }).then(result => {
      if (result) {
        this.gameService.removeAds();
        alert("¡Anuncios eliminados!");
      }
    });
  }
}