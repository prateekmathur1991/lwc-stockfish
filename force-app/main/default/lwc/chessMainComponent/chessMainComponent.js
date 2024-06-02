import { LightningElement } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';

import jQuery from "@salesforce/resourceUrl/jQuery";
import chessboardcss from "@salesforce/resourceUrl/chessboardcss";
import chessboardjs from "@salesforce/resourceUrl/chessboardjs";
import chesspieces from "@salesforce/resourceUrl/chesspieces";

import * as boardUtils from './chessBoardJSUtils';

export default class ChessMainComponent extends LightningElement {

    renderedCallbackExecuted = false;
    chessBoard;

    async renderedCallback() {

        if (this.renderedCallbackExecuted) {
            return;
        }
        
        await Promise.all([
            loadStyle(this, chessboardcss),
            loadScript(this, jQuery),
            loadScript(this, chessboardjs)
        ]);

        this.renderedCallbackExecuted = true;

        this.chessBoard = Chessboard(
            this.refs.mainChessBoard, 
            {
                position: 'start',
                draggable: true,
                moveSpeed: 'slow',
                pieceTheme: chesspieces + '/img/chesspieces/wikipedia/{piece}.png',
                onDrop: boardUtils.onBoardPositionChange.bind(this)
            }
        );
    }

    updateBoardPosition(updatedFENString) {
        this.chessBoard.position(updatedFENString);
    }
}