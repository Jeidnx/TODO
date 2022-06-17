import {Client, Entity, Schema} from "redis-om";
import {Todo as TodoInterface} from "../types";

const client = new Client();

class Todo extends Entity{}

const schema = new Schema(
    Todo,
    {
        description: { type: 'text'},
        priority: { type: 'number', sortable: true},
    },
    {
        dataStructure: 'HASH',
        prefix: 'todo'
    }
);

async function connect() {
    if (!client.isOpen()){
        await client.open(process.env.REDIS_URL);
        await client.fetchRepository(schema).createIndex();
    }
}

export async function getTodos(): Promise<TodoInterface[]> {
    await connect();
    const repository = client.fetchRepository(schema);

    return repository.search().sortDesc('priority').returnAll().then((todos) => {
        return todos.map((todo) => (todo.toJSON() as unknown as  TodoInterface));
    });
}

export async function addTodo(data: TodoInterface): Promise<void> {
    await connect();
    const repository = client.fetchRepository(schema);

    // @ts-ignore
    return repository.createAndSave(data).then(() => {});
}