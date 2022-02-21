/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const GETTEXT_DOMAIN = 'my-indicator-extension';
const Gettext = imports.gettext.domain(GETTEXT_DOMAIN);
const _ = Gettext.gettext;

const { GObject, St, Gio, Gtk } = imports.gi;
const Clutter = imports.gi.Clutter;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;
const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

let color_effect;
let contrast_effect;

function _toggleEffect() {
    if ( Main.uiGroup.has_effects( color_effect ) ) {
        Main.uiGroup.remove_effect( color_effect );
        Main.uiGroup.remove_effect( contrast_effect );
    } else {
        Main.uiGroup.add_effect( color_effect );
        Main.uiGroup.add_effect( contrast_effect );
    }
}


const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('Greyscale Indicator'));

       this.add_child(new St.Icon({
            icon_name: 'applications-graphics-symbolic',
            style_class: 'system-status-icon',
        }));
	
        let item = new PopupMenu.PopupMenuItem(_('Toggle greyscale'));
        item.connect('activate', () => {
            _toggleEffect();
        });
        this.menu.addMenuItem(item);
        
        //let slider = Gtk.Scale.new_with_range(Gtk.GTK_ORIENTATION_HORIZONTAL, 0, 1, 0.1)
        //this.menu.addMenuItem(slider)
    }
});

class Extension {
    constructor(uuid) {
        this._uuid = uuid;

        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    enable() {
	this._indicator = new Indicator();
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init(meta) {

    //Creation of effect
    color_effect = new Clutter.DesaturateEffect();
    contrast_effect = new Clutter.BrightnessContrastEffect();
    contrast_effect.set_contrast(0.08)
    
    return new Extension(meta.uuid);
}
