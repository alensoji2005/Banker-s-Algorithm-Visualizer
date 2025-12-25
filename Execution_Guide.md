# Banker's Algorithm Visualizer: Execution Guide

This guide details how to run the application and use its features.

## 1. Setup Instructions 

This application is a 100% client-side tool and requires **no server or build steps**.

To run the application:
1. Ensure all project files (`index.html`, `style.css`, and the `js/` folder) are in the same directory.
2. Open your terminal or command prompt.
3. Navigate into your project folder (the one that contains index.html).
4. Run this single command 
python -m http.server or py -m http.server
5. Your terminal will say "Serving HTTP on... port 8000".
6. Now, go to your web browser and open this address: http://localhost:8000
7. The application will load and be ready for use immediately.

## 2. User Interface Guide 

The interface is split into three main sections:

### **Parameters (Input)**
* **Processes (P):** Enter the number of processes.
* **Resources (R):** Enter the number of resource types.
* **Create Tables:** Click this to generate the input tables based on the numbers above.
* **Input Tables (`Available`, `Max`, `Allocation`):** Fill in these tables with your desired integer values.
* **Run Algorithm:** Click this to run the safety algorithm on your inputs. This calculates the `Need` matrix, generates the execution steps, and prepares the animation canvas.

### **Animation (Controls)**
* **Play/Pause:** Starts or pauses the automatic step-by-step animation.
* **Step Back:** Moves the animation one step backward.
* **Step Forward:** Moves the animation one step forward.
* **Speed Slider:** Controls the speed of the "Play" mode.
* **Export as PNG:** Saves a screenshot of the current animation canvas.

### **Execution Details (Output)**
* **Safe Sequence:** Displays the final safe sequence (e.g., `P1 -> P3 -> ...`) if the system is safe.
* **Log:** A real-time log that prints the algorithm's thoughts and actions at each step.

## 3. Animation Features & Visualization 

The canvas visualizes the algorithm's state in real-time:
* **Tables:** The `Allocation`, `Need`, `Work`, and `Finish` vectors/matrices are drawn on the canvas.
* **Color-Coded Highlighting[cite: 49]:**
    * **Yellow:** The process row currently being checked by the algorithm.
    * **Red:** The process row has failed the safety check (`Need > Work`) and must wait.
    * **Green:** The process row has passed the safety check (`Need <= Work`). The animation will then show its resources being released and added to the `Work` vector.
* **Log Message:** The text at the bottom of the canvas states the action being performed in the current step.

## 4. Browser Requirements 

The application runs on any modern web browser that supports **HTML5 Canvas** and **JavaScript ES6 Modules**.

* **Google Chrome** (Version 80+)
* **Mozilla Firefox** (Version 78+)
* **Microsoft Edge** (Version 80+)
* **Apple Safari** (Version 14+)