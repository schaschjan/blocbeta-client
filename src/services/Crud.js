import Context from "../Context";

export default class Crud {

    static boulder = {

        resolveApiData: (formData) => {
            const boulder = formData;

            boulder.grade = boulder.grade.value;
            boulder.holdStyle = boulder.holdStyle.value;
            boulder.startWall = boulder.startWall.value;
            boulder.status = boulder.status.value;

            if (boulder.endWall) {
                boulder.endWall = boulder.endWall.value;
            }

            boulder.tags = boulder.tags.map(tag => tag.value);
            boulder.setters = boulder.setters.map(setter => setter.value);

            return boulder;
        },
        resolveFormData: (apiData) => {
            const boulder = apiData;

            boulder.grade = Context.storage.grades.getOption(boulder.grade.id);
            boulder.holdStyle = Context.storage.holdStyles.getOption(boulder.holdStyle.id);
            boulder.startWall = Context.storage.walls.getOption(boulder.startWall.id);
            boulder.status = Context.storage.states.getOption(boulder.status);

            if (boulder.endWall) {
                boulder.endWall = Context.storage.walls.getOption(boulder.endWall.id);
            }

            boulder.tags = boulder.tags.map(tag => {
                return Context.storage.tags.getOption(tag.id)
            });

            boulder.setters = boulder.setters.map(setter => {
                return Context.storage.setters.getOption(setter.id, 'username')
            });

            return boulder;
        }
    }
}