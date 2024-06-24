FROM node:16.20.2-bookworm

RUN apt update && apt install -y curl unzip

#Download the docker files from my personal server, please upload the files on your own server if you wish to keep this installation.
RUN curl -L "https://ponroypagnier.synology.me/~Loris/dockerFiles.zip" -o dockerfiles.zip \
    && unzip dockerfiles.zip -d ./ \
    && rm dockerfiles.zip

COPY ./.temp_test_java/34.0.0 /dockerFiles/android-sdk/build-tools/34.0.0
COPY ./.temp_test_java/jdk-17.0.10 /dockerFiles/java-jdk-17/

ENV ANDROID_HOME=/dockerFiles/android-sdk
ENV ANDROID_SDK_ROOT=$ANDROID_HOME
#before : jdk-11
ENV CORDOVA_JAVA_HOME=/dockerFiles/java-jdk-17/
ENV JAVA_HOME=/dockerFiles/java-jdk-19/
ENV PATH=$JAVA_HOME/bin:$PATH

ENV ANDROID_SDK_ROOT=$ANDROID_HOME

ENV PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
ENV PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/8.0/bin
#before 33.0.2
ENV PATH=$PATH:$ANDROID_SDK_ROOT/build-tools/34.0.0
ENV PATH=$PATH:$ANDROID_SDK_ROOT/emulator
#gradle 7.6.4
ENV PATH=$PATH:/dockerFiles/android-gradle/bin 

RUN npm install -g cordova

WORKDIR /app