import { INVALID_MOVE } from 'boardgame.io/core';

const setupDeck = (ctx) => {
  // We need 56 cards, 8 sets of 0..6
  let allCards = [0, 1, 2, 3, 4, 5, 6];
  // 2 * 2 * 2 = 8
  allCards = allCards.concat(allCards);
  allCards = allCards.concat(allCards);
  allCards = allCards.concat(allCards);

  let allHands = {};
  // Scoreboard
  let scores = {};
  // Distribute the cards
  for (var i = 0; i < ctx.numPlayers; i++) {
    allHands[i] = [];
    scores[i] = 0;
    for (var j = 0; j < 6; j++) {
      drawToHand(allHands[i], allCards);
    }
  }

  let discard = [];
  drawToHand(discard, allCards);

  return {'deck': allCards, 'discard': discard, 'hands': allHands, 'scoreboard': scores};
};

const transferCard = (src, dest, src_idx) => {
  dest.push(src.splice(src_idx, 1)[0]);
}

const drawToHand = (hand, deck) => {
  // Pick a random idx
  let idx = Math.floor(Math.random() * deck.length);
  // Pick from deck and deliver to hand
  transferCard(deck, hand, idx);
};

const isValidMove = (hand, discard, card) => {
  let idx = hand.indexOf(card);
  let c0 = idx >= 0;  // card must be in hand
  let c11 = ((discard.slice(-1)[0] + 1) % 7) === card
  let c12 = (discard.slice(-1)[0] % 7) === card
  return c0 && (c11 || c12);
} 
const Lama = {
  name: "lama",

  setup: (ctx, setupData) => setupDeck(ctx),

  phases: {
    phaseA: {
      start: true,
      next: "phaseA",
      moves: {
        drawCard: (G, ctx) => {
          drawToHand(G.hands[ctx.currentPlayer], G.deck);
          ctx.events.endTurn();
        },
        playCard: (G, ctx, card) => {
          let hand = G.hands[ctx.currentPlayer];
          if (isValidMove(hand, G.discard, card)) {
            let idx = hand.indexOf(card);
            transferCard(hand, G.discard, idx);
            ctx.events.endTurn();
          } else {
            return INVALID_MOVE;
          }
        },
        fold: (G, ctx) => {
          ctx.events.pass({ remove: true });
        },
      },

      turn: {
        onMove: (G, ctx) => {
          if (G.hands[ctx.currentPlayer].length === 0)
            ctx.events.endPhase();
        }
      },
      onEnd: (G, ctx) => {
        for (var i = 0; i < ctx.numPlayers; i++) {
          G['scoreboard'][i] += [...new Set(G.hands[i])].
            reduce((a,b) => a + b, 0);
        }
        return G;
      }
    }
  }
};

export default Lama;
