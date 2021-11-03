import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GroupService } from 'src/group/group.service';
import { ItemService } from 'src/item/item.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly groupService: GroupService,
    private readonly itemService: ItemService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    const request = context.switchToHttp().getRequest();

    const user = request.user; // Get User information from Request.
    const paramsId: string = request.params.id; // Get Route parameter ID from Request.
    let userRole = null;

    // Check if user has a globalManager role then allow to access the route.
    for (const element of user.roles) {
      if (element.role.toLowerCase() === 'globalmanager') {
        userRole = element;
        break;
      }
    }

    // If User doesn't have globalManager role then check it's role permission.
    if (!userRole) {
      // Get Group IDs which is assigned to a User.
      const groupIds = user.roles.map(e => e.groupId);

      // Get All the groups which is assigned to a user.
      const userGroups = await this.groupService.getGroupByIds(groupIds);

      // Get All the items which are under group collections of a user.
      const userItems = await this.itemService.getCollectionItems(userGroups.flatMap(e => e.collectionIds));
      let currentItem = null;

      // Iterate Items in a User assigned groups.
      for (const element of userItems) {
        // Check if ID provided in param exist in user permissions list.
        if (new RegExp(paramsId).test(element._id.toString())) {
          currentItem = element;
          break;
        }
      }

      // If Item ID provided in Params found in user permissions list, then check permission level of a user.
      if (currentItem) {
      // Iterate user assigned groups.
        for (const group of userGroups) {
          if (group.collectionIds.includes(currentItem.parentId)) {
            // Check type of role user has in provided Collection ID provided in Params.
            for (const role of user.roles) {
              if (role.groupId.toString() === group._id.toString()) {
                userRole = role;
                break;
              }
            }
          }
        }
      }
    }

    // Returns user permission in Boolean.
    return roles.includes(userRole?.role.toLowerCase());
  }
}
