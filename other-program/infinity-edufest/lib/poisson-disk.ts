/**
 * Poisson Disk Sampling
 * Generates evenly distributed points in 2D space
 * Adapted for TypeScript and particle systems
 */

interface Point {
    x: number;
    y: number;
}

export class PoissonDiskSampling {
    private width: number;
    private height: number;
    private minDistance: number;
    private maxAttempts: number;
    private cellSize: number;
    private gridWidth: number;
    private gridHeight: number;
    private grid: (Point | null)[][];
    private activeList: Point[];
    private points: Point[];

    constructor(
        width: number,
        height: number,
        minDistance: number = 10,
        maxAttempts: number = 30
    ) {
        this.width = width;
        this.height = height;
        this.minDistance = minDistance;
        this.maxAttempts = maxAttempts;

        // Cell size for spatial grid (optimization)
        this.cellSize = minDistance / Math.sqrt(2);
        this.gridWidth = Math.ceil(width / this.cellSize);
        this.gridHeight = Math.ceil(height / this.cellSize);

        // Initialize grid
        this.grid = Array(this.gridHeight)
            .fill(null)
            .map(() => Array(this.gridWidth).fill(null));

        this.activeList = [];
        this.points = [];
    }

    /**
     * Generate points using Poisson Disk Sampling
     */
    generate(): Point[] {
        // Start with a random point
        const firstPoint: Point = {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
        };

        this.addPoint(firstPoint);

        while (this.activeList.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.activeList.length);
            const point = this.activeList[randomIndex];
            let found = false;

            for (let i = 0; i < this.maxAttempts; i++) {
                const newPoint = this.generatePointAround(point);

                if (this.isValid(newPoint)) {
                    this.addPoint(newPoint);
                    found = true;
                    break;
                }
            }

            if (!found) {
                this.activeList.splice(randomIndex, 1);
            }
        }

        return this.points;
    }

    /**
     * Generate points in a circular area
     */
    generateInCircle(centerX: number, centerY: number, radius: number, count: number = 10): Point[] {
        const localPoints: Point[] = [];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius;

            const point: Point = {
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
            };

            if (point.x >= 0 && point.x < this.width && point.y >= 0 && point.y < this.height) {
                localPoints.push(point);
            }
        }

        return localPoints;
    }

    private addPoint(point: Point): void {
        this.points.push(point);
        this.activeList.push(point);

        const gridX = Math.floor(point.x / this.cellSize);
        const gridY = Math.floor(point.y / this.cellSize);

        if (gridX >= 0 && gridX < this.gridWidth && gridY >= 0 && gridY < this.gridHeight) {
            this.grid[gridY][gridX] = point;
        }
    }

    private generatePointAround(point: Point): Point {
        const angle = Math.random() * Math.PI * 2;
        const radius = this.minDistance + Math.random() * this.minDistance;

        return {
            x: point.x + Math.cos(angle) * radius,
            y: point.y + Math.sin(angle) * radius,
        };
    }

    private isValid(point: Point): boolean {
        // Check bounds
        if (point.x < 0 || point.x >= this.width || point.y < 0 || point.y >= this.height) {
            return false;
        }

        // Check distance to nearby points
        const gridX = Math.floor(point.x / this.cellSize);
        const gridY = Math.floor(point.y / this.cellSize);

        const searchRadius = 2;

        for (let y = Math.max(0, gridY - searchRadius); y <= Math.min(this.gridHeight - 1, gridY + searchRadius); y++) {
            for (let x = Math.max(0, gridX - searchRadius); x <= Math.min(this.gridWidth - 1, gridX + searchRadius); x++) {
                const neighbor = this.grid[y][x];

                if (neighbor) {
                    const distance = Math.sqrt(
                        Math.pow(point.x - neighbor.x, 2) + Math.pow(point.y - neighbor.y, 2)
                    );

                    if (distance < this.minDistance) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    /**
     * Reset the sampler for new generation
     */
    reset(): void {
        this.grid = Array(this.gridHeight)
            .fill(null)
            .map(() => Array(this.gridWidth).fill(null));
        this.activeList = [];
        this.points = [];
    }
}
