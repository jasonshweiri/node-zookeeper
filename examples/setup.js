const { createClient } = require('./wrapper.js');
const notifier = require('./notifier.js');
const { createNode, persistentNode } = require('./createnode.js');

const noop = () => {};

async function createNodes(paths) {
    const client = createClient();

    client.on('close', () => {
        notifier.emit('close', `session closed, id=${client.client_id}`);
    });

    client.connect({}, noop);

    await client.on_connected();
    notifier.emit('connect', `session established, id=${client.client_id}`);

    const promises = [];
    paths.forEach((path) => {
        promises.push(createNode(client, path, persistentNode));
    });

    const messages = await Promise.all(promises);
    messages.forEach((message) => {
        notifier.emit('createNode', message);
    });
}

module.exports = {
    createNodes,
};
