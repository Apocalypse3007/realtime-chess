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
    
    useEffect(() => {
        if(!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            switch (message.type) {
                case init_game: {
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

    // const handleMove = (move: { from: string; to: string }) => {
    //     if (!socket) return;
        
    //     try {
    //         const updatedChess = new Chess(chess.fen());
    //         updatedChess.move(move);
            
    //         // Send move to server
    //         socket.send(JSON.stringify({
    //             type: MOVE,
    //             payload: move
    //         }));
            
    //         // Update local state
    //         setChess(updatedChess);
    //         setBoard(updatedChess.board());
    //     } catch (error) {
    //         console.error("Invalid move:", error);
    //     }
    // };

    if(!socket) return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Connecting to server...
    </div>
    
    return (
        <div className="justify-center flex">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-6 gap-4 w-full">
                    <div className="col-span-4 bg-red-200 w-full">
                        <Chessboard board={board} socket={socket} />
                    </div>
                    <div className="col-span-2 h-full w-full flex flex-col items-center justify-center">
                        <button onClick={() => {
                            socket.send(JSON.stringify({
                                type: init_game
                            }))
                        }} >
                            Play
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};