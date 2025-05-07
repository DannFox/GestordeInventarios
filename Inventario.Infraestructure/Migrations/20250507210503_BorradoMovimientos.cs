using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Inventario.Infraestructure.Migrations
{
    /// <inheritdoc />
    public partial class BorradoMovimientos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Movimientos");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Movimientos",
                columns: table => new
                {
                    id_movimiento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_producto = table.Column<int>(type: "int", nullable: false),
                    id_usuario = table.Column<int>(type: "int", nullable: false),
                    cantidad = table.Column<int>(type: "int", nullable: false),
                    fecha_movimiento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    tipo_movimiento = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movimientos", x => x.id_movimiento);
                    table.ForeignKey(
                        name: "FK_Movimientos_Productos_id_producto",
                        column: x => x.id_producto,
                        principalTable: "Productos",
                        principalColumn: "id_producto",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Movimientos_Usuarios_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "Usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Movimientos_id_producto",
                table: "Movimientos",
                column: "id_producto");

            migrationBuilder.CreateIndex(
                name: "IX_Movimientos_id_usuario",
                table: "Movimientos",
                column: "id_usuario");
        }
    }
}
