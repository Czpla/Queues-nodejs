import Queue from "bull";
import redisConfig from '../../config/redis';
import * as jobs from '../jobs';

const queues = Object.values(jobs).map(job => ({
    bull: new Queue(job.key, redisConfig),
    name: job.key,
    handle: job.handle
}));

export default {
    queues,
    add(name, data) {
        const queue = queues.find(queue => queue.name === name);

        return queue.bull.add(data);
    }, 
    process() {
        return this.queues.forEach(queue => {
            queue.bull.process(queue.handle);

            queue.bull.on('failed', (job, error) => {
                console.log('Job failed', queue.key, job.data);
                console.log(error);
            });
        });
    }
};

