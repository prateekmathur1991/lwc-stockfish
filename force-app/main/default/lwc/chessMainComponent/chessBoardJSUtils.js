import {Chess} from './chess';

async function onBoardPositionChange(source, target, piece, newPos, oldPos, orientation) {

    // Append other parameters required to construct a completely valid FEN
    let currentBoardPositionFEN = Chessboard.objToFen(newPos) + ' b - - 1 11';

    let stockfishNextMove = await getStockfishNextMove(currentBoardPositionFEN);

    let chessGameInstance = new Chess(currentBoardPositionFEN);
    chessGameInstance.move(stockfishNextMove);

    this.updateBoardPosition(chessGameInstance.fen());
}

async function getStockfishNextMove(currentBoardPositionFEN) {

    let searchParamsObject = new URLSearchParams({
        'fen' : currentBoardPositionFEN,
        'depth' : 15
    });

    let stockfishRawResponse = await fetch('https://stockfish.online/api/s/v2.php?' + searchParamsObject);
    let stockfishResponseJSON = await stockfishRawResponse.json();
    
    let bestMoveString = stockfishResponseJSON.bestmove;

    // Use a regular expression to find and extract the bestmove
    const bestMoveMatch = bestMoveString.match(/bestmove\s+(\S+)/);
    return bestMoveMatch ? bestMoveMatch[1] : '';
}

export { onBoardPositionChange };