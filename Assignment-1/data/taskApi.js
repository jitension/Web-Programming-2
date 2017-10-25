const mongoCollections = require("../config/mongoCollections");
const tasks = mongoCollections.tasks;
const uuid = require('node-uuid');


let exportedMethods = {
    getAllTasks(skips, take) {
        return tasks().then((tasksCollection) => {
            return tasksCollection.find({}).skip(skips).limit(take).toArray();
        });
    },

    getTaskById(id) {
        return tasks().then((tasksCollection) => {
            return tasksCollection.findOne({ _id: id });
        });
    },

    createTask(data) {
        if (!data.title || !data.description || !data.hoursEstimated || !data.completed) {
            alert("please provide all the details!");
            return;
        }
        return tasks().then((tasksCollection) => {
            let newTasks = {
                _id: data.id,
                title: data.title,
                description: data.description,
                hoursEstimated: data.hoursEstimated,
                completed: data.completed,
                comments: data.comments
            };

            return tasksCollection.insertOne(newTasks).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getTaskById(newId);
            });
        });
    },

    updateTasks(id, data) {
        return tasks().then((tasksCollection) => {
            let updatedTask = {
                _id: data._id,
                title: data.title,
                description: data.description,
                hoursEstimated: data.hoursEstimated,
                completed: data.completed,
                comments: data.comments

            };

            return tasksCollection.updateOne({ _id: id }, updatedTask).then(() => {
                return this.getTaskById(id);
            });
        });
    },

    updateTasksWithPatch(id, data) {
        return tasks().then((tasksCollection) => {
            let updatedTask = {
                $set: {
                    title: data.title,
                    description: data.description,
                    hoursEstimated: data.hoursEstimated,
                    completed: data.completed
                }
            };

            return tasksCollection.updateOne({ _id: id }, updatedTask).then(() => {
                return this.getTaskById(id);
            });
        });
    },

    addComments(id, data) {
        return tasks().then((tasksCollection) => {
            let addComment = {
                $push: {
                    comments: {
                        _id: uuid.v4(),
                        name: data.name,
                        comment: data.comment
                    }
                }
            };

            return tasksCollection.updateOne({ _id: id }, addComment).then(() => {
                return this.getTaskById(id);
            });
        });
    },


    deleteComment(id, commentId) {
        return tasks().then((tasksCollection) => {
            let deleteCom = {
                $pull: {
                    comments:
                    {
                        _id: commentId
                    }
                }
            };
            return tasksCollection.update({ _id: id }, deleteCom).then(() => {
                return this.getTaskById(id);
            });
        });
    }
}

module.exports = exportedMethods;