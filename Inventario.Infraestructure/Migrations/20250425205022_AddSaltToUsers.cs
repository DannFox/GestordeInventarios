﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Inventario.Infraestructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSaltToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "salt",
                table: "Usuarios",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "salt",
                table: "Usuarios");
        }
    }
}
