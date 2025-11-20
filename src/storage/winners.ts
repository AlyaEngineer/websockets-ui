interface WinnerEntry {
  name: string;
  wins: number;
}

const winners: WinnerEntry[] = [];

export const winnersStorage = {
  ensurePlayer(name: string) {
    const existing = winners.find((w) => w.name === name);
    if (!existing) {
      winners.push({ name, wins: 0 });
    }
  },

  addWin(name: string) {
    const entry = winners.find((w) => w.name === name);
    if (entry) entry.wins++;
  },

  getAll() {
    return winners;
  },
};
