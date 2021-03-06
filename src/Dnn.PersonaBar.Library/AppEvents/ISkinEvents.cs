﻿#region Copyright
// DotNetNuke® - http://www.dotnetnuke.com
// Copyright (c) 2002-2016
// by DotNetNuke Corporation
// All Rights Reserved
#endregion

using DotNetNuke.UI.Skins.EventListeners;

namespace Dnn.PersonaBar.Library.AppEvents
{
    /// <summary>
    /// This interface defines methods that need to be called in skins lifecycle.
    /// </summary>
    public interface ISkinEvents
    {
        /// <summary>
        /// call durgin skin skin event.
        /// </summary>
        /// <param name="e"></param>
        void Init(SkinEventArgs e);

        /// <summary>
        /// call durgin skin load event.
        /// </summary>
        /// <param name="e"></param>
        void Load(SkinEventArgs e);

        /// <summary>
        /// call durgin skin pre render event.
        /// </summary>
        /// <param name="e"></param>
        void PreRender(SkinEventArgs e);

        /// <summary>
        /// call durgin skin unload event.
        /// </summary>
        /// <param name="e"></param>
        void UnLoad(SkinEventArgs e);
    }
}
