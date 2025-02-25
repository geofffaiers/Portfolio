export class Bubble {
    topPosition: number;
    leftPosition: number;
    leftMovement: number;
    topMovement: number;
    size: number;
    popped: boolean;
    popStartTime: number | null;
    appearStartTime: number | null;
    popRed: number;
    popGreen: number;
    popBlue: number;

    constructor (topPos: number, leftPos: number, top: number, left: number, size: number) {
        this.topPosition = topPos;
        this.leftPosition = leftPos;
        this.leftMovement = left;
        this.topMovement = top;
        this.size = size;
        this.popped = false;
        this.popStartTime = null;
        this.appearStartTime = null;
        this.popRed = 43;
        this.popGreen = 156;
        this.popBlue = 191;
        this.setAutoPop();
    }

    setAutoPop (): void {
        const popDuration = Math.random() * 8000 + 2000; // 2 to 10 seconds
        setTimeout(() => {
            if (!this.popped) {
                this.pop(237, 54, 54);
            }
        }, popDuration);
    }

    update (width: number, height: number): void {
        if (this.leftPosition < 0 || this.leftPosition > width) {
            this.leftMovement = -this.leftMovement;
        }
        if (this.topPosition < 0 || this.topPosition > height) {
            this.topMovement = -this.topMovement;
        }
        this.leftPosition += this.leftMovement;
        this.topPosition += this.topMovement;
    }

    draw (ctx: CanvasRenderingContext2D, currentTime: number): void {
        if (this.appearStartTime === null) {
            this.appearStartTime = currentTime;
        }
        const appearElapsed = currentTime - this.appearStartTime;
        const appearDuration = 500;
        let size = this.size;
        let opacity = 1;
        if (appearElapsed < appearDuration) {
            const appearProgress = appearElapsed / appearDuration;
            size = this.size * appearProgress;
            opacity = appearProgress;
        }

        if (this.popped) {
            if (this.popStartTime === null) {
                this.popStartTime = currentTime;
            }
            const popElapsed = currentTime - this.popStartTime;
            const popDuration = 300;
            if (popElapsed < popDuration) {
                const popProgress = popElapsed / popDuration;
                size = this.size * (1 + popProgress * 0.5);
                opacity = 1 - popProgress;
            } else {
                return;
            }
            ctx.strokeStyle = `rgba(${this.popRed}, ${this.popGreen}, ${this.popBlue}, ${opacity})`;
            ctx.fillStyle = `rgba(${this.popRed}, ${this.popGreen}, ${this.popBlue}, ${0.25 * opacity})`;
            ctx.lineWidth = 4 * opacity;
            ctx.beginPath();
            ctx.arc(this.leftPosition, this.topPosition, size, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        } else {
            ctx.fillStyle = `rgba(43, 156, 191, ${0.25 * opacity})`;
            ctx.strokeStyle = `rgba(43, 156, 191, ${opacity})`;
            ctx.lineWidth = 4 * opacity;
            ctx.beginPath();
            ctx.arc(this.leftPosition, this.topPosition, size, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
    }

    isCursorOver (x: number, y: number): boolean {
        const dx = this.leftPosition - x;
        const dy = this.topPosition - y;
        return Math.sqrt(dx * dx + dy * dy) < this.size;
    }

    pop (red: number = 25, green: number = 196, blue: number = 68): void {
        this.popped = true;
        this.popRed = red;
        this.popGreen = green;
        this.popBlue = blue;
    }
}
