# Banker's Algorithm Visualizer
This project is a web-based interactive animation tool that visualizes the Banker's Algorithm, a core operating system concept for deadlock avoidance. It is built entirely with client-side technologies (HTML5, CSS3, and JavaScript) and uses the Canvas API for all animations, as specified by the project requirements.

The application allows users to input custom parameters for processes and resources, and then observe a real-time, step-by-step demonstration of the safety algorithm.

## ✨ Features

This tool implements all core functionality specified in the project brief:

**Interactive Parameter Input:** Users can dynamically set the number of processes and resources, and then fill in the `Available`, `Max`, and `Allocation` matrices.

**Step-by-Step Animation:** The visualization runs on the HTML5 Canvas, showing each step of the algorithm's check.

**Full Animation Controls:** The interface includes controls for **Play/Pause**, **Step-Forward**, and **Step-Backward**.

**Configurable Speed:** A slider allows the user to adjust the animation speed in real-time.


**Real-time Visualization:** The tool clearly visualizes the `Allocation`, `Need`, `Work`, and `Finish` data structures.

**Color-Coded Elements:** The currently inspected process is highlighted, with its row color-coded green if the `Need <= Work` check passes and red if it fails.

**Real-time Statistics:** The final safe sequence (or a message indicating an unsafe state) is displayed, and a detailed execution log tracks every step.

**Export Functionality:** A button allows the user to export the current state of the animation canvas as a `.png` screenshot.

**Modular Code:** The JavaScript is organized into separate modules for UI, the algorithm logic, and the animation/drawing logic, as required.

