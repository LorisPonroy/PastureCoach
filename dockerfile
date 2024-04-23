FROM node:16.20.2-bookworm
RUN apt update

COPY dockerFiles/java-jdk-11 /java-jdk-11
COPY dockerFiles/java-jdk-19 /java-jdk-19
COPY dockerFiles/android-sdk /android-sdk
#gradle 7.6.4
COPY dockerFiles/android-gradle /android-gradle

ENV ANDROID_HOME=/android-sdk
ENV ANDROID_SDK_ROOT=$ANDROID_HOME

ENV CORDOVA_JAVA_HOME=/java-jdk-11/
ENV JAVA_HOME=/java-jdk-19/
ENV PATH=$JAVA_HOME/bin:$PATH

ENV ANDROID_SDK_ROOT=$ANDROID_HOME

ENV PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
ENV PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/8.0/bin
ENV PATH=$PATH:$ANDROID_SDK_ROOT/build-tools/33.0.2
ENV PATH=$PATH:$ANDROID_SDK_ROOT/emulator

ENV PATH=$PATH:/android-gradle/bin

RUN npm install -g cordova

WORKDIR /app