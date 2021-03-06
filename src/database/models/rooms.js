export default (sequelize, DataTypes) => {
  const Rooms = sequelize.define(
    "Rooms",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      accommodationId: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Available",
        validate: {
          isIn: {
            args: [["Available", "Unavailable"]],
            msg: "Status can only be Available or Unavailable",
          },
        },
      },
      price: { type: DataTypes.FLOAT, allowNull: false },
    },
    {}
  );
  Rooms.associate = (models) => {
    Rooms.belongsTo(models.Accommodations, {
      foreignKey: "accommodationId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Rooms.hasMany(models.Bookings, {
      foreignKey: "roomId",
      onDelete: "CASCADE",
    });
  };
  return Rooms;
};
