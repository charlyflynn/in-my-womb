export const draggable = (object) => {
    object.setInteractive({ cursor: "pointer" });
    object.body.allowGravity = false;

    const onDrag = ({ y }) => {
        object.y = y;
    };
    const stopDrag = () => {
        object.on("pointerdown", startDrag);
        object.off("pointerup", stopDrag);
        object.off("pointermove", onDrag);
    };
    const startDrag = () => {
        object.off("pointerdown", startDrag);
        object.on("pointerup", stopDrag);
        object.on("pointermove", onDrag);
    };

    object.on("pointerdown", startDrag);
    object.on("destroy", () => {
        object.off("pointerdown", startDrag);
        object.off("pointerup", stopDrag);
        object.off("pointermove", onDrag);
    });

    return object;
};

