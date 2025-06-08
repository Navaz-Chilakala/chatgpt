const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let tool = 'pencil';
let drawing = false;
let startX = 0;
let startY = 0;
let shapes = [];

function setActive(buttonId) {
    document.querySelectorAll('#toolbar button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(buttonId).classList.add('active');
}

function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => {
        if (shape.type === 'line') {
            ctx.beginPath();
            ctx.moveTo(shape.x1, shape.y1);
            ctx.lineTo(shape.x2, shape.y2);
            ctx.stroke();
        } else if (shape.type === 'rect') {
            ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
        } else if (shape.type === 'path') {
            ctx.beginPath();
            shape.points.forEach((p, i) => {
                if (i === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
        }
    });
}

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    if (tool === 'pencil') {
        shapes.push({ type: 'path', points: [{ x: startX, y: startY }] });
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const x = e.offsetX;
    const y = e.offsetY;
    if (tool === 'pencil') {
        const path = shapes[shapes.length - 1];
        path.points.push({ x, y });
        drawAll();
    } else {
        drawAll();
        if (tool === 'rect') {
            ctx.strokeRect(startX, startY, x - startX, y - startY);
        } else if (tool === 'line') {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (!drawing) return;
    drawing = false;
    const x = e.offsetX;
    const y = e.offsetY;
    if (tool === 'rect') {
        shapes.push({ type: 'rect', x: startX, y: startY, w: x - startX, h: y - startY });
    } else if (tool === 'line') {
        shapes.push({ type: 'line', x1: startX, y1: startY, x2: x, y2: y });
    }
    drawAll();
});

canvas.addEventListener('mouseleave', () => {
    drawing = false;
});

// Toolbar actions
['pencil', 'rectangle', 'line'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
        tool = id === 'rectangle' ? 'rect' : id;
        setActive(id);
    });
});

document.getElementById('clear').addEventListener('click', () => {
    shapes = [];
    drawAll();
});
