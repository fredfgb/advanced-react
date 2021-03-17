// At it's simples, the access control returns a yes or no value
// depending on the users session

import { ListAccessArgs } from './types';
import { permissionsList } from './schemas/fields';

export function isSignedIn({ session }: ListAccessArgs) {
    return !!session;
}

const generatedPermissions = Object.fromEntries(
    permissionsList.map((permission) => [
        permission,
        function ({ session }: ListAccessArgs) {
            return !!session?.data.role?.[permission];
        },
    ])
);

// permissions checks if someone meets a criteria - yes or no
export const permissions = {
    ...generatedPermissions,
};

// Rule based function
// rules can return a boolean - yes or no - or filter which limits which products they can CRUD
export const rules = {
    canManageProducts({ session }: ListAccessArgs) {
        if (!isSignedIn({ session })) {
            return false;
        }
        // 1. Do they have the permission of canManageProducts
        if (permissions.canManageProducts({ session })) {
            return true;
        }
        return { user: { id: session.itemId } };
    },

    canOrder({ session }: ListAccessArgs) {
        if (!isSignedIn({ session })) {
            return false;
        }
        // 1. Do they have the permission of canManageProducts
        if (permissions.canManageCart({ session })) {
            return true;
        }
        return { user: { id: session.itemId } };
    },
    canManageOrderItems({ session }: ListAccessArgs) {
        if (!isSignedIn({ session })) {
            return false;
        }
        // 1. Do they have the permission of canManageProducts
        if (permissions.canManageCart({ session })) {
            return true;
        }
        return { order: { user: { id: session.itemId } } };
    },
    canReadProducts({ session }: ListAccessArgs) {
        if (!isSignedIn({ session })) {
            return false;
        }
        if (permissions.canManageProducts({ session })) {
            return true;
        }
        // they can only see available products
        return { status: 'AVAILABLE' };
    },
    canManageUsers({ session }: ListAccessArgs) {
        if (!isSignedIn({ session })) {
            return false;
        }
        // 1. Do they have the permission of canManageProducts
        if (permissions.canManageUsers({ session })) {
            return true;
        }
        // only update themselves them
        return { id: session.itemId };
    },
};
