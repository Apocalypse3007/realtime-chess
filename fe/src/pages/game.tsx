import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
import { Chessboard } from "../components/chessboard";

export const init_game = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [hasClickedPlay, setHasClickedPlay] = useState(false);
    const [userColor, setUserColor] = useState<string | null>(null);
    
    useEffect(() => {
        if(!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            switch (message.type) {
                case init_game: {
                    setUserColor(message.payload.color);
                    const newChess = new Chess();
                    setChess(newChess);
                    setBoard(newChess.board());
                    console.log("Game initialized");
                    break;
                }
                case MOVE: {
                    const move = message.payload;
                    try {
                        const updatedChess = new Chess(chess.fen());
                        updatedChess.move(move);
                        setChess(updatedChess);
                        setBoard(updatedChess.board());
                    } catch (error) {
                        console.error("Invalid move:", error);
                    }
                    // Log and store the move
                    console.log("Move received:", message.data);
                    break;
                }
                case GAME_OVER:
                    console.log("Game over:", message.data);
                    break;
            }
        }
    }, [socket, chess]);

    if(!socket) return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Connecting to server...
    </div>
    
    return (
        <div className="justify-center flex">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-6 gap-4 w-full h-[70vh]">
                    <div className="col-span-4 w-full h-full flex items-center justify-center">
                        <div className="w-full h-full aspect-square max-w-full max-h-full flex items-center justify-center">
                            <Chessboard board={board} socket={socket} />
                        </div>
                    </div>
                    <div className="col-span-2 h-full w-full flex flex-col items-center justify-center">
                        {!userColor ? (
                            <button
                                onClick={() => {
                                    if (!hasClickedPlay) {
                                        socket.send(JSON.stringify({
                                            type: init_game
                                        }));
                                        setHasClickedPlay(true);
                                    }
                                }}
                                disabled={hasClickedPlay}
                                className={hasClickedPlay ? 'opacity-50 cursor-not-allowed' : ''}
                            >
                                Play
                            </button>
                        ) : (
                            <div className="text-lg font-semibold text-center p-4 rounded shadow">
                                You have joined a game and <span className="capitalize font-bold">{userColor}</span> is your color
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};