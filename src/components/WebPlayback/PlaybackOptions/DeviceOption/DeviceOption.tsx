import React from "react";
import { Device } from "@spotify/web-api-ts-sdk";
import { PiDevices } from "react-icons/pi";
import sdk from "@/lib/ClientInstance";
import css from "./DeviceOption.module.css";

interface DeviceOptionProps {
    currentDevice: Device;
    availableDevices: Device[];
}
const DeviceOption = ({
    currentDevice,
    availableDevices,
}: DeviceOptionProps) => {
    const handleDeviceChange = async (device: Device) => {
        if (device.is_active || !device.id) return;

        await sdk.player.transferPlayback([device.id], true);
    };

    return (
        <div className={css.relativeContainer}>
            <div className={css.absoluteContainer}>
                <div className={css.deviceContainer}>
                    <div className={css.deviceIcon}>
                        <PiDevices size={32} color={"#1DB954"} />
                    </div>
                    <div className={css.deviceInfo}>
                        <div className={css.title}>Appareil actuel</div>
                        <div className={css.currentDevice}>
                            {currentDevice.name}
                        </div>
                    </div>
                </div>
                <div className={css.select}>Sélectionnez au autre appareil</div>
                {availableDevices.map((device) => {
                    return (
                        <div
                            key={device.id}
                            className={css.deviceContainer}
                            onClick={() => handleDeviceChange(device)}
                        >
                            <div className={css.deviceIcon}>
                                <PiDevices size={32} color={"#b3b2b2"} />
                            </div>
                            <div className={css.deviceInfo}>{device.name}</div>
                        </div>
                    );
                })}
            </div>
            <div className={css.triangleTooltip}></div>
        </div>
    );
};

export default DeviceOption;
