import React, { useState, useEffect } from 'react';
import { remote } from 'electron';

import TitleBar from 'frameless-titlebar';

const currentWindow = remote.getCurrentWindow();

const Titlebar = () => {
    // manage window state, default to currentWindow maximized state
    const [maximized, setMaximized] = useState(currentWindow.isMaximized());
    // add window listeners for currentWindow
    useEffect(() => {
        const onMaximized = () => setMaximized(true);
        const onRestore = () => setMaximized(false);
        currentWindow.on("maximize", onMaximized);
        currentWindow.on("unmaximize", onRestore);
        return () => {
            currentWindow.removeListener("maximize", onMaximized);
            currentWindow.removeListener("unmaximize", onRestore);
        }
    }, []);

    // used by double click on the titlebar
    // and by the maximize control button
    const handleMaximize = () => {
        if (maximized) {
            currentWindow.restore();
        } else {
            currentWindow.maximize();
        }
    }

    return (
        <div>
            <TitleBar
                currentWindow={currentWindow} // electron window instance
                platform={process.platform} // win32, darwin, linux
                theme={{
                    // any theme overrides specific
                    // to your application :)
                }}
                title="Nsuns 5/3/1"
                onClose={() => currentWindow.close()}
                onMinimize={() => currentWindow.minimize()}
                onMaximize={handleMaximize}
                // when the titlebar is double clicked
                onDoubleClick={handleMaximize}
                // hide minimize windows control
                disableMinimize={false}
                // hide maximize windows control
                disableMaximize={false}
                // is the current window maximized?
                maximized={maximized}
            >
                {/* custom titlebar items */}
            </TitleBar>
        </div>
    )
}

export default Titlebar;