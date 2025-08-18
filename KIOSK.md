# Kiosk Deployment Guide - Raspberry Pi

This guide provides step-by-step instructions for deploying the Household COO application on a Raspberry Pi in kiosk mode.

## Hardware Requirements

- **Raspberry Pi 4** (recommended) or Pi 3B+
- **microSD card** (32GB+ recommended)
- **Touchscreen display** or HDMI monitor with USB touchscreen
- **Power supply** (official Pi power adapter recommended)
- **Network connection** (for initial setup and updates)

## Software Prerequisites

- **Raspberry Pi OS Lite** (latest version)
- **Chromium browser**
- **Unclutter** (to hide mouse cursor)
- **X11** server

## Installation Steps

### 1. Prepare Raspberry Pi OS

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y \
  chromium-browser \
  unclutter \
  xorg \
  openbox \
  lightdm \
  nginx
