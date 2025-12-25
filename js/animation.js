
export class Animation {
    constructor(ctx, inputs, steps) {
        this.ctx = ctx;
        this.inputs = inputs;
        this.steps = steps;
        
        this.currentStep = 0;
        this.isPlaying = false;
        this.speed = 5; // From 1 to 10
        this.lastFrameTime = 0;
        
        // Initialize animation state
        this.animationState = this.createStateFromStep(0);
        
        // Bind the animate function
        this.animate = this.animate.bind(this);
    }

    /**
     * Creates a state snapshot from a given step index.
     * This is crucial for step-backward.
     */
    createStateFromStep(stepIndex) {
        let state = {
            work: [...this.inputs.available],
            finish: Array(this.inputs.numProcesses).fill(false),
            highlightedProcess: -1,
            granted: null,
            message: ""
        };

        // Re-run the steps from the beginning to this index
        for (let i = 0; i <= stepIndex; i++) {
            const step = this.steps[i];
            if (!step) continue;

            if (step.work) state.work = [...step.work];
            if (step.finish) state.finish = [...step.finish];
            if (step.currentProcess !== undefined) state.highlightedProcess = step.currentProcess;
            
            state.granted = step.granted !== undefined ? step.granted : null;
            state.message = step.message;
        }
        return state;
    }

    /**
     * Main drawing function.
     * This is called on every frame.
     */
    draw() {
        // --- Get inputs for calculation ---
        const { numProcesses, numResources } = this.inputs;

        // --- Define Layout Constants ---
        const cellWidth = 45;
        const cellHeight = 30;
        const padding = 10;
        const startX = 20;
        let startY = 40; // Top padding for title

        // --- START: DYNAMIC SIZING LOGIC ---
        
        // Calculate required height
        let requiredHeight = startY + 
                             (numProcesses + 1) * cellHeight + // Alloc/Need tables
                             padding * 4 + 
                             (1 + 1) * cellHeight + // Work/Finish tables
                             padding + 
                             cellHeight + // Log message
                             padding; // Bottom padding
        
        // Ensure minimum height
        requiredHeight = Math.max(requiredHeight, 400);

        // Calculate widths of each table block
        const allocTableWidth = (numResources + 1) * cellWidth;
        const needTableWidth = (numResources + 1) * cellWidth;
        const finishTableWidth = (numProcesses + 1) * cellWidth; // Uses processes, not resources

        // Determine start position for the second column
        const needStartX = startX + allocTableWidth + (padding * 3); // Gap between table columns

        // The second column's width is the WIDEST of the Need and Finish tables
        const rightColumnWidth = Math.max(needTableWidth, finishTableWidth);

        // The total canvas width is the start of the 2nd column + its width + padding
        let requiredWidth = needStartX + rightColumnWidth + startX; // startX acts as right-padding
        
        // Ensure minimum width
        requiredWidth = Math.max(requiredWidth, 800);
        
        // --- Set the canvas size ---
        this.ctx.canvas.width = requiredWidth;
        this.ctx.canvas.height = requiredHeight;

        // --- END: DYNAMIC SIZING LOGIC ---
        
        // Now get the final width/height and clear
        const { width, height } = this.ctx.canvas;
        this.ctx.clearRect(0, 0, width, height);
        
        // --- START: BACKGROUND FIX ---
        // Manually draw a white background for the PNG export
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, width, height);
        // --- END: BACKGROUND FIX ---
        
        // --- Get state ---
        const { work, finish, highlightedProcess, granted, message } = this.animationState;
        const { allocation, need } = this.inputs;

        // --- Column Headers ---
        const resourceHeaders = Array.from({ length: numResources }, (_, j) => `R${j}`);
        const processHeaders = Array.from({ length: numProcesses }, (_, i) => `P${i}`);

        // --- 1. Draw Allocation Table ---
        this.ctx.fillStyle = "black";
        this.ctx.font = "bold 16px Arial";
        this.ctx.textAlign = "left"; 
        this.ctx.fillText("Allocation Matrix (A)", startX, startY - 15);
        this.drawTable(
            this.ctx, 
            allocation, 
            startX, startY, 
            cellWidth, cellHeight, 
            resourceHeaders, processHeaders,
            highlightedProcess // Pass highlight
        );

        // --- 2. Draw Need Table ---
        this.ctx.fillStyle = "black";
        this.ctx.font = "bold 16px Arial";
        this.ctx.textAlign = "left"; 
        this.ctx.fillText("Need Matrix (C - A)", needStartX, startY - 15);
        this.drawTable(
            this.ctx, 
            need, 
            needStartX, startY, 
            cellWidth, cellHeight, 
            resourceHeaders, processHeaders,
            highlightedProcess, // Pass highlight
            granted // Pass granted status for color-coding
        );

        // --- 3. Draw Available (Work) Vector ---
        startY += (numProcesses + 1) * cellHeight + padding * 4;
        this.ctx.fillStyle = "black";
        this.ctx.font = "bold 16px Arial";
        this.ctx.textAlign = "left"; 
        this.ctx.fillText("Work Vector (W)", startX, startY - 15);
        this.drawTable(
            this.ctx, 
            [work], // Pass as a 1-row matrix
            startX, startY, 
            cellWidth, cellHeight, 
            resourceHeaders, ["Work"],
            -1 // No row highlight
        );

        // --- 4. Draw Finish Vector ---
        let finishStartX = needStartX; // Align with the Need table
        this.ctx.fillStyle = "black";
        this.ctx.font = "bold 16px Arial";
        this.ctx.textAlign = "left"; 
        this.ctx.fillText("Finish Vector", finishStartX, startY - 15);
        this.drawTable(
            this.ctx,
            [finish.map(val => (val ? "T" : "F"))], // Pass as 1-row matrix
            finishStartX, startY,
            cellWidth, cellHeight,
            processHeaders, ["Finish"],
            -1
        );

        // --- 5. Draw Log Message ---
        startY += cellHeight * 2 + padding;
        this.ctx.fillStyle = "black";
        this.ctx.font = "14px Arial";
        this.ctx.textAlign = "left"; 
        this.ctx.fillText(`Step ${this.currentStep + 1}/${this.steps.length}: ${message}`, startX, startY);
    }

    /**
     * Helper function to draw a table on the canvas.
     */
    drawTable(ctx, data, startX, startY, cellWidth, cellHeight, headers, rowLabels, highlightedRow = -1, rowStatus = null) {
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        const headerY = startY;
        // Draw column headers
        for (let j = 0; j < headers.length; j++) {
            let x = startX + (j + 1) * cellWidth;
            ctx.fillStyle = "#333";
            ctx.fillText(headers[j], x + cellWidth / 2, headerY + cellHeight / 2);
            ctx.strokeStyle = "#aaa";
            ctx.strokeRect(x, headerY, cellWidth, cellHeight);
        }

        // Draw rows
        for (let i = 0; i < data.length; i++) {
            let y = startY + (i + 1) * cellHeight;
            
            // Draw row label
            let labelX = startX;
            ctx.fillStyle = "#333";
            ctx.fillText(rowLabels[i], labelX + cellWidth / 2, y + cellHeight / 2);
            ctx.strokeStyle = "#aaa";
            ctx.strokeRect(labelX, y, cellWidth, cellHeight);
            
            // Apply highlight
            if (i === highlightedRow) {
                if (rowStatus === true) {
                    ctx.fillStyle = "rgba(0, 255, 0, 0.3)"; // Green
                } else if (rowStatus === false) {
                    ctx.fillStyle = "rgba(255, 0, 0, 0.3)"; // Red
                } else {
                    ctx.fillStyle = "rgba(255, 255, 0, 0.3)"; // Yellow
                }
                ctx.fillRect(labelX, y, (headers.length + 1) * cellWidth, cellHeight);
            }
            
            // Draw cells
            for (let j = 0; j < headers.length; j++) {
                let x = startX + (j + 1) * cellWidth;
                
                // Draw cell content
                ctx.fillStyle = "black";
                ctx.fillText(data[i][j], x + cellWidth / 2, y + cellHeight / 2);
                
                // Draw cell border
                ctx.strokeStyle = "#aaa";
                ctx.strokeRect(x, y, cellWidth, cellHeight);
            }
        }
        
        // Draw top-left empty cell border
        ctx.strokeRect(startX, startY, cellWidth, cellHeight);
    }

    // --- Animation Controls ---
    
    stepForward() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.animationState = this.createStateFromStep(this.currentStep);
            this.draw();
        }
    }
    
    stepBackward() {
         if (this.currentStep > 0) {
            this.currentStep--;
            this.animationState = this.createStateFromStep(this.currentStep);
            this.draw();
        }
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.lastFrameTime = performance.now();
            this.animate();
        }
    }
    
    animate(now) {
        if (!this.isPlaying) return;

        // Calculate time elapsed
        const delay = 1100 - (this.speed * 100); // Delay from ~1000ms to 100ms
        const elapsed = now - this.lastFrameTime;

        if (elapsed > delay) {
            this.lastFrameTime = now - (elapsed % delay);
            if (this.currentStep < this.steps.length - 1) {
                this.stepForward();
            } else {
                this.isPlaying = false; // Stop at the end
            }
        }
        
        requestAnimationFrame(this.animate);
    }
    
    setSpeed(val) {
        // val is 1-10
        this.speed = parseInt(val);
    }
    
    exportPNG() {
        // This fulfills the "Export functionality for screenshots" requirement
        const dataURL = this.ctx.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'bankers-algorithm-snapshot.png';
        link.href = dataURL;
        link.click();
    }
}