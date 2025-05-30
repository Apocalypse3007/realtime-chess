import { type Color, type PieceSymbol, type Square } from "chess.js";
import React, { useState } from "react";
export const Chessboard = ({ board, socket }: {
  board: ({
    square?: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket | null;
}) => {
  const [from, setFrom] = useState<null | Square>(null);

  const getPieceImage = (piece: { type: PieceSymbol; color: Color }) => {
    const file = piece.type.toUpperCase();
    const col = piece.color === "w" ? "w" : "b";
    return `/assets/chess/${col}${file}.png`;
  };

  return (
    <div className="text-white-200">
      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => {
            // Calculate chess square notation always
            const squareName = `${String.fromCharCode(97 + j)}${8 - i}` as Square;
            return (
              <div
                key={j}
                className={`w-16 h-16 ${(i + j) % 2 === 0 ? "bg-green-500" : "bg-white"} relative`}
                onClick={() => {
                  // Only allow selecting a piece as the source square
                  if (!from) {
                    if (square && square.square) {
                      setFrom(squareName);
                    }
                  } else {
                    // Only send if destination is different and valid
                    if (squareName !== from && from && socket) {
                      socket.send(
                        JSON.stringify({
                          type: "move",
                          payload: {
                            from,
                            to: squareName
                          },
                        })
                      );
                    }
                    setFrom(null);
                  }
                }}
              >
                {square && (
                  <img
                    src={getPieceImage(square)}
                    alt={`${square.color}${square.type}`}
                    className="w-3/4 h-3/4 m-auto"
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Chessboard;
