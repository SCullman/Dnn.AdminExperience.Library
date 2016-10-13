﻿using System;
using System.Data;
using DotNetNuke.Common.Utilities;

namespace Dnn.PersonaBar.Library.Data
{
    public class DataService : IDataService
    {
        protected static readonly DotNetNuke.Data.DataProvider DataProvider = DotNetNuke.Data.DataProvider.Instance();

        public int SavePersonaBarMenu(string identifier, string moduleName, string controller, string resourceKey, string path,
            string link, string cssClass, bool mobileSupport, int parentId, int order, bool allowHost, bool enabled, int currentUserId)
        {
            return DataProvider.ExecuteScalar<int>("SavePersonaBarMenu", identifier, moduleName, controller, resourceKey, path,
                Null.GetNull(link, DBNull.Value), Null.GetNull(cssClass, DBNull.Value),
                mobileSupport, Null.GetNull(parentId, DBNull.Value), order, allowHost, enabled, currentUserId);
        }

        public IDataReader GetPersonaBarMenu()
        {
            return DataProvider.ExecuteReader("GetPersonaBarMenu");
        }

        public void DeletePersonaBarMenuByIdentifier(string identifier)
        {
            DataProvider.ExecuteNonQuery("DeletePersonaBarMenuByIdentifier", identifier);
        }

        public int SavePersonaBarExtension(int extensionId, string identifier, int menuId, string controller, string container,
            string path, int order, bool enabled, int currentUserId)
        {
            return DataProvider.ExecuteScalar<int>("SavePersonaBarExtension", extensionId, identifier, menuId,
                controller, container, path, order, enabled, currentUserId);
        }

        public void DeletePersonaBarExtension(string identifier)
        {
            DataProvider.ExecuteNonQuery("DeletePersonaBarExtension", identifier);
        }

        public IDataReader GetPersonaBarExtensions()
        {
            return DataProvider.ExecuteReader("GetPersonaBarExtensions");
        }

        public int SavePersonaBarMenuDefaultRoles(int menuId, string roleNames)
        {
            return DataProvider.ExecuteScalar<int>("SavePersonaBarMenuDefaultRoles", menuId, roleNames);
        }

        public string GetPersonaBarMenuDefaultRoles(int menuId)
        {
            return DataProvider.ExecuteScalar<string>("GetPersonaBarMenuDefaultRoles", menuId);
        }

        public int SavePersonaBarPermission(int menuPermissionId, int portalId, int menuId, int permissionId, int roleId,
            int userId, bool allowAccees, int currentUserId)
        {
            return DataProvider.ExecuteScalar<int>("SavePersonaBarMenuPermission", menuPermissionId, DataProvider.GetNull(portalId), menuId, permissionId,
                DataProvider.GetNull(roleId), DataProvider.GetNull(userId), allowAccees, currentUserId);
        }

        public IDataReader GetPersonbaBarPermissionsByPortal(int portalId)
        {
            return DataProvider.ExecuteReader("GetPersonaBarMenuPermissionsByPortal", portalId);
        }

        public void DeletePersonbaBarPermissionsByMenuId(int portalId, int menuId)
        {
            DataProvider.ExecuteNonQuery("DeletePersonaBarMenuPermissionsByMenuId", portalId, menuId);
        }

        public void DeletePersonbaBarPermissionsById(int menuPermissionId)
        {
            DataProvider.ExecuteNonQuery("DeletePersonaBarMenuPermissionById", menuPermissionId);
        }
    }
}