class State {
    constructor() {
        this.inProgress = false;
        this.completed = 0;
        this.total = 0;
        this.processed = 0;
    }
}
/**
 * Singleton service to provide updates about the batch articles update.
 */
module.exports = class UpdateStatusService {
    constructor() {
        this.state = new State();
    }

    startProgress(total) {
        this.state.total = total;
        this.state.inProgress = true;
    }

    updateStatus() {
        this.state.processed++;
        this.completed = (this.processed / this.total ) * 100;
    }

    getStatus() {
        return this.state;
    }

    clear() {
        this.state = new State();
    }
}