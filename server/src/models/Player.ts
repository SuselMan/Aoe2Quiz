import mongoose from 'mongoose';
import config from '../config';

export interface IPlayer {
  deviceId: string;
  name: string;
  countryCode: string;
  rating: number;
  updatedAt: Date;
}

const playerSchema = new mongoose.Schema<IPlayer>(
  {
    deviceId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    countryCode: { type: String, required: true },
    rating: { type: Number, required: true, default: config.INITIAL_ELO },
  },
  { timestamps: true }
);

export const Player = mongoose.model<IPlayer>('Player', playerSchema);
