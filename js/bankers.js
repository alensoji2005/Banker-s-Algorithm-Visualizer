
export class BankersAlgorithm {
    constructor({ available, max, allocation, need, numProcesses, numResources }) {
        this.available = available;
        this.max = max;
        this.allocation = allocation;
        this.need = need;
        this.P = numProcesses;
        this.R = numResources;
        
        this.safeSequence = [];
        this.steps = []; // Stores the step-by-step execution for animation
    }

    /**
     * Runs the safety algorithm.
     * @returns {Array} A log of steps for the animation.
     */
    run() {
        // --- SAFETY ALGORITHM ---
        
        // 1. Initialize Work and Finish
        let work = [...this.available];
        let finish = Array(this.P).fill(false);
        
        this.steps = []; // Clear previous steps
        this.safeSequence = [];
        
        this.logStep('Initialization', { work: [...work], finish: [...finish] });

        let found = true;
        while (found) {
            found = false;
            for (let i = 0; i < this.P; i++) {
                // 2. Find an index i such that Finish[i] == false AND Need[i] <= Work
                this.logStep(`Checking P${i}`, { currentProcess: i });
                
                if (finish[i] === false && this.isNeedLessOrEqual(i, work)) {
                    this.logStep(`P${i}: Need <= Work. Granting request.`, { 
                        currentProcess: i, 
                        granted: true 
                    });
                    
                    // 3. Update Work: Work = Work + Allocation[i]
                    for (let j = 0; j < this.R; j++) {
                        work[j] += this.allocation[i][j];
                    }
                    
                    finish[i] = true;
                    this.safeSequence.push(i);
                    found = true;
                    
                    this.logStep(`P${i} finished. Releasing resources.`, { 
                        currentProcess: i, 
                        work: [...work],
                        finish: [...finish]
                    });
                } else if (finish[i] === true) {
                     this.logStep(`P${i} is already finished.`, { currentProcess: i });
                } else {
                     this.logStep(`P${i}: Need > Work. Must wait.`, { 
                         currentProcess: i, 
                         granted: false 
                    });
                }
            }
        } // End of while loop

        // 4. Check if system is safe
        if (this.safeSequence.length === this.P) {
            this.logStep('All processes finished. System is in a SAFE state.');
        } else {
            this.logStep('Deadlock detected. System is in an UNSAFE state.');
        }
        
        return this.steps;
    }

    /** Helper to check if Need[i] <= Work */
    isNeedLessOrEqual(processIndex, work) {
        for (let j = 0; j < this.R; j++) {
            if (this.need[processIndex][j] > work[j]) {
                return false;
            }
        }
        return true;
    }
    
    /** Helper to log a step for the animator */
    logStep(message, data = {}) {
        this.steps.push({ message, ...data });
    }
}