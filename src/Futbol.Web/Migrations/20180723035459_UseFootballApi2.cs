using Microsoft.EntityFrameworkCore.Migrations;

namespace Futbol.Web.Migrations
{
    public partial class UseFootballApi2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Code",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "CrestUrl",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "ShortName",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "SquadMarketValue",
                table: "Teams");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "Teams",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CrestUrl",
                table: "Teams",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShortName",
                table: "Teams",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SquadMarketValue",
                table: "Teams",
                nullable: true);
        }
    }
}
