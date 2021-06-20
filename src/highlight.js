const WORKLET_NAME = "highlight";
const CUSTOM_PROPERTY_COLOR = "--highlight-color";
const CUSTOM_PROPERTY_ANGLE = "--highlight-angle";

class Highlight {
    static get inputProperties() {
        return [CUSTOM_PROPERTY_COLOR, CUSTOM_PROPERTY_ANGLE];
    }

    static get inputArguments() {
        return [];
    }

    paint(context, geometry, properties) {
        const color = properties.get(CUSTOM_PROPERTY_COLOR);
        const angleInRad = this.parseAngle(properties.get(CUSTOM_PROPERTY_ANGLE));

        const offsetLength = this.calculateOffset(geometry.height, angleInRad);
        context.fillStyle = color;
        context.beginPath();
        if (this.isPositive(angleInRad)) {
            // Draw rect "leaning right"
            context.moveTo(offsetLength, 0);
            context.lineTo(geometry.width, 0);
            context.lineTo(geometry.width - offsetLength, geometry.height);
            context.lineTo(0, geometry.height);
        } else {
            // Draw rect "leaning left"
            context.moveTo(0, 0);
            context.lineTo(geometry.width + offsetLength, 0);
            context.lineTo(geometry.width, geometry.height);
            context.lineTo(0 - offsetLength, geometry.height);
        }
        context.fill();
    }

    calculateOffset(side, angle) {
        return side * Math.tan(angle);
    }

    isPositive(num) {
        return Math.sign(num) >= 0;
    }

    deg2Rad(deg) {
        return deg * (Math.PI / 180);
    }

    grad2Rad(grad) {
        return grad * (Math.PI / 200);
    }

    turn2Rad(turn) {
        return turn * (2 * Math.PI);
    }

    parseAngle(angle) {
        const { value, unit } = angle;
        return ({
            'rad': value,
            'deg': this.deg2Rad(value),
            'grad': this.grad2Rad(value),
            'turn': this.turn2Rad(value)
        })[unit] ?? 0;
    }
}

// Register our paint worklet
registerPaint(WORKLET_NAME, Highlight);