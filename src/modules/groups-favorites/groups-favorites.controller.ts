import { Controller, UseGuards, Get, Query, Request, Post, Param, Delete } from '@nestjs/common';
import { GroupsFavoritesService } from './groups-favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
export class GroupsFavoritesController {
  constructor(
    private readonly groupsFavoritesService: GroupsFavoritesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getFavoriteGroups(@Request() req) {
    return this.groupsFavoritesService.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  addFavoriteGroup(@Request() req, @Param('id') groupId: string) {
    return this.groupsFavoritesService.addFavoriteGroup(req.user.id, groupId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteFavoriteGroup(@Request() req, @Param('id') groupId: string) {
    return this.groupsFavoritesService.deleteFavoriteGroup(req.user.id, groupId);
  }
}
