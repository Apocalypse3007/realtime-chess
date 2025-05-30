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
  const [hoveredSquare, setHoveredSquare] = useState<Square | null>(null);

  const getPieceImage = (piece: { type: PieceSymbol; color: Color }) => {
    const file = piece.type.toUpperCase();
    const col = piece.color === "w" ? "w" : "b";
    return `/${col}${file}.png`;
  };

  const getSquareColor = (i: number, j: number, isHovered: boolean, isSelected: boolean) => {
    const isLight = (i + j) % 2 === 0;
    const baseColor = isLight ? "bg-green-600" : "bg-yellow-100";
    
    if (isSelected) {
      return isLight ? "bg-blue-500" : "bg-blue-300";
    }
    if (isHovered) {
      return isLight ? "bg-emerald-500" : "bg-emerald-300";
    }
    return baseColor;
  };

  return (
    <div className="text-white-200 p-4 rounded-lg shadow-2xl bg-gray-800">
      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => {
            const squareName = `${String.fromCharCode(97 + j)}${8 - i}` as Square;
            const isHovered = hoveredSquare === squareName;
            const isSelected = from === squareName;
            
            return (
              <div
                key={j}
                className={`w-16 h-16 ${getSquareColor(i, j, isHovered, isSelected)} 
                  relative transition-colors duration-200 ease-in-out
                  flex items-center justify-center
                  ${square ? 'cursor-pointer' : 'cursor-default'}
                  hover:shadow-inner`}
                onClick={() => {
                  if (!from) {
                    if (square && square.square) {
                      setFrom(squareName);
                    }
                  } else {
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
                onMouseEnter={() => setHoveredSquare(squareName)}
                onMouseLeave={() => setHoveredSquare(null)}
              >
                {square && (
                  <img
                    src={getPieceImage(square)}
                    alt={`${square.color}${square.type}`}
                    className={`w-3/4 h-3/4 m-auto transition-transform duration-200
                      ${isSelected ? 'scale-110' : 'hover:scale-105'}
                      drop-shadow-lg`}
                  />
                )}
                {(i === 7 || j === 0) && (
                  <span className={`absolute text-xs font-bold
                    ${i === 7 ? 'bottom-0 right-1' : 'top-1 left-1'}
                    ${(i + j) % 2 === 0 ? 'text-black' : 'text-black'}`}>
                    {i === 7 ? String.fromCharCode(97 + j) : 8 - i}
                  </span>
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
