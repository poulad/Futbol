using Microsoft.EntityFrameworkCore.Migrations;

namespace Futbol.Web.Migrations
{
    public partial class EditTeam : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MarketValue",
                table: "Teams",
                newName: "SquadMarketValue");

            migrationBuilder.RenameColumn(
                name: "FlagUrl",
                table: "Teams",
                newName: "CrestUrl");

            migrationBuilder.AlterColumn<string>(
                name: "ShortName",
                table: "Teams",
                nullable: true,
                oldClrType: typeof(string));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SquadMarketValue",
                table: "Teams",
                newName: "MarketValue");

            migrationBuilder.RenameColumn(
                name: "CrestUrl",
                table: "Teams",
                newName: "FlagUrl");

            migrationBuilder.AlterColumn<string>(
                name: "ShortName",
                table: "Teams",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
