/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function assert(condition, message) { 
    if (!condition)
        throw Error("Assert failed" + (typeof message !== "undefined" ? ": " + message : ""));
}

 function measureTextHeight(left, top, width, height,text) {

        // Draw the text in the specified area
        ctx.save();
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.baseline = "top";
        ctx.fillText(text, 0, 35); // This seems like tall text...  Doesn't it?
        ctx.restore();

        // Get the pixel data from the canvas
        var data = ctx.getImageData(left, top, width, height).data,
            first = false, 
            last = false,
            r = height,
            c = 0;

        // Find the last line with a non-white pixel
        while(!last && r) {
            r--;
            for(c = 0; c < width; c++) {
                if(data[r * width * 4 + c * 4 + 3]) {
                    last = r;
                    break;
                }
            }
        }

        // Find the first line with a non-white pixel
        while(r) {
            r--;
            for(c = 0; c < width; c++) {
                if(data[r * width * 4 + c * 4 + 3]) {
                    first = r;
                    break;
                }
            }

            // If we've got it then return the height
            if(first !== r) return last - first;
        }

        // We screwed something up...  What do you expect from free code?
        return 0;
    }