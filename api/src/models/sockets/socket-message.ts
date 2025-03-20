import { ErrorMessage } from "./error-message";
import { NewMessage, ReadMessage, UpdatedMessage } from "./messaging";
import { UpdatedGame, UpdatedPlayers, UpdatedRoom, UpdatedRound } from "./planning-poker";
import { DeleteProfile, UpdatedProfile } from "./profile";

export type SocketMessage = DeleteProfile | ErrorMessage | NewMessage | ReadMessage | UpdatedMessage | UpdatedProfile | UpdatedRoom | UpdatedPlayers | UpdatedGame | UpdatedRound;
