document.addEventListener('DOMContentLoaded', function() {
    const containers = document.querySelectorAll('body');
    const numOfShapes = 20; // Total number of shapes available (shape-01 to shape-20)
    const maxShapesToPlace = 40; // Maximum number of shapes to place

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function placeRandomShapes(container) {
        for (let i = 0; i < maxShapesToPlace; i++) {
            const shapeNum = String(getRandomInt(1, numOfShapes)).padStart(2, '0'); // Pad with 0 to ensure two digits
            const shapePath = `/images/decor/shape-${shapeNum}.svg`;
            const shapeElement = document.createElement('img');
            shapeElement.src = shapePath;
            shapeElement.classList.add('decoration');

            // Randomly place the shape in the container
            shapeElement.style.position = 'absolute';
            shapeElement.style.left = `${getRandomInt(0, 90)}%`; // Random left position
            shapeElement.style.top = `${getRandomInt(0, 90)}%`; // Random top position

            // Randomly scale and rotate the shapes
            shapeElement.style.transform = `rotate(${getRandomInt(0, 360)}deg) scale(${Math.random() * 0.5 + 0.5})`;

            shapeElement.style.zIndex = -1; // Send the shapes to the back

            container.appendChild(shapeElement);
        }
    }

    // For each container, set the position to relative and call the placeRandomShapes function
    containers.forEach(container => {
        container.style.position = 'relative';
        container.style.width = '100%';
        //container.style.height = '100%';
        container.style.height = '100vh';

        container.style.overflow = 'hidden';
        placeRandomShapes(container);
    });
});
