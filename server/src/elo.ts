import config from './config';

/**
 * Standard ELO update. Returns new rating.
 * result: 1 = win, 0.5 = draw, 0 = loss
 */
export function eloUpdate(myRating: number, opponentRating: number, result: 1 | 0.5 | 0): number {
  const expected = 1 / (1 + Math.pow(10, (opponentRating - myRating) / 400));
  const newRating = myRating + config.ELO_K * (result - expected);
  return Math.round(newRating);
}

export function getNewRatings(
  ratingA: number,
  ratingB: number,
  result: 'win_a' | 'win_b' | 'draw'
): { ratingA: number; ratingB: number } {
  if (result === 'win_a') {
    return {
      ratingA: eloUpdate(ratingA, ratingB, 1),
      ratingB: eloUpdate(ratingB, ratingA, 0),
    };
  }
  if (result === 'win_b') {
    return {
      ratingA: eloUpdate(ratingA, ratingB, 0),
      ratingB: eloUpdate(ratingB, ratingA, 1),
    };
  }
  return {
    ratingA: eloUpdate(ratingA, ratingB, 0.5),
    ratingB: eloUpdate(ratingB, ratingA, 0.5),
  };
}
